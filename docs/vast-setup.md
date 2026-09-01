# Vast.ai Setup — RTX 4090 for Wan 2.4-14B Inference

Spin up a GPU instance on [Vast.ai](https://vast.ai) to run a self-hosted Wan 2.4-14B inference server for VeilWick.

## Prerequisites

- [Vast.ai](https://vast.ai) account with billing added
- `vast` CLI installed: `pip install vastclient` or use the web UI
- Wan 2.4-14B model weights (or a prebuilt Docker image)

## Step 1: Search for a RTX 4090 offer

Use the Vast CLI or web UI to list available RTX 4090 instances:

```bash
vast search offers 'gpu_name=RTX_4090 num_gpus=1 reliability>=0.95 verified=any' \
  --limit 10 \
  -o 'dph_total-asc'
```

Or in the web UI, filter by:
- **GPU**: RTX 4090
- **Min RAM**: 32 GB
- **Storage**: ≥ 100 GB SSD
- **Reliability**: ≥ 0.95
- **Sort by**: Price (lowest first)

### Minimum specs for Wan 2.4-14B

| Requirement | Value |
|---|---|
| GPU VRAM | 24 GB (required for FP8 + offload) |
| GPU | RTX 4090 (1× minimum, 2× for 720p+) |
| System RAM | 32 GB |
| Storage | 100 GB SSD (weights ~30 GB + room) |
| Bandwidth | ≥ 1 Gbps |

## Step 2: Create an instance

### Via CLI

```bash
vast create instance <offer-id> \
  --image pytorch/pytorch:2.5.1-cuda12.4-cudnn9-devel \
  --disk 100 \
  --ssh-port 22 \
  --ports 8000:8000/tcp \
  --env 'HF_TOKEN=<your-hf-token>'
```

### Via Web UI

1. Click **"Rent"** on an offer card.
2. Under **Template / Image**, search for `pytorch/pytorch:2.5.1-cuda12.4-cudnn9-devel`.
3. Set **Disk** to at least 100 GB.
4. Under **Ports**, expose **8000** (TCP).
5. Add environment variable `HF_TOKEN` with your HuggingFace token.
6. Click **"Rent Instance"**.

### On-Demand vs Spot pricing

| Provider | RTX 4090 on-demand | RTX 4090 spot/bid | Notes |
|---|---|---|---|
| **Vast.ai** | $0.40–0.60/hr | **$0.25–0.40/hr** | Spot is cheapest but hosts can evict; verify host reputation score |
| **TensorDock** | **$0.42/hr** (flat) | n/a | Flat pricing, no bid game, no evictions — best for production API |
| **Lambda** | $0.54/hr | n/a | Owned datacenters, SLA, best uptime |
| **RunPod Community** | $0.74/hr (Secure) | $0.38–0.45/hr | Community = interruptible; Secure = owned, guaranteed |

> **Recommendation:** Use **Vast.ai spot ($0.25–0.40/hr)** for development/batch work with checkpointing. Use **TensorDock ($0.42/hr flat)** for the production inference API — no evictions, predictable cost.

## Step 3: Install and run Wan inference server

SSH into the instance and run:

```bash
# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
pip install diffusers transformers accelerate sentencepiece

# Clone Wan 2.4-14B
git clone https://huggingface.co/Wan-AI/Wan2.4-14B /root/wan-model

# Start a simple inference server (FastAPI-based)
cat > /root/server.py << 'EOF'
import torch
from diffusers import WanPipeline
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
import uvicorn

app = FastAPI()
pipe = WanPipeline.from_pretrained(
    "/root/wan-model",
    torch_dtype=torch.bfloat16,
    variant="fp8",
)
pipe.to("cuda")

@app.post("/v1/video")
async def generate(data: dict):
    prompt = data.get("prompt", "")
    if not prompt:
        raise HTTPException(400, "prompt required")
    frames = pipe(
        prompt=prompt,
        num_frames=data.get("num_frames", 81),
        height=data.get("height", 480),
        width=data.get("width", 832),
    ).frames[0]
    # Return raw video bytes (MVP: placeholder)
    return {"frames": len(frames), "status": "ok", "prompt": prompt}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Launch
python /root/server.py
```

To keep it running after SSH disconnect:

```bash
screen -S wan-server
python /root/server.py
# Ctrl+A, D to detach
```

## Step 4: Configure VeilWick to use your Vast instance

```bash
# .dev.vars or wrangler secret
VAST_API_KEY=<vast-api-key-or-any-nonempty-token>
VAST_INSTANCE_IP=<ip-of-your-vast-instance>
```

The `getVastEndpoint()` function in `wan.ts` reads these and builds `http://<ip>:8000/v1/video`.

## Step 5: Verify the endpoint

```bash
curl -X POST http://<vast-ip>:8000/v1/video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $VAST_API_KEY" \
  -d '{"prompt": "woman doing yoga in a sunny studio, 24fps"}'
```

## Cost Breakdown

| Component | Rate | Est. monthly (24/7) | Est. monthly (8hr/day) |
|---|---|---|---|
| Vast.ai RTX 4090 spot | $0.30/hr | **$216** | **$72** |
| TensorDock RTX 4090 on-demand | $0.42/hr | **$302** | **$101** |
| Lambda RTX 4090 | $0.54/hr | **$389** | **$130** |
| Storage (100 GB SSD) | ~$0.004/GB/day | ~$12 | ~$12 |
| Egress (Vast.ai, 1–10 Gbps) | Free | $0 | $0 |
| **Total (Vast spot, 8hr/day)** | | | **~$84/mo** |

> Prices are Q1 2025 estimates. Verify live on [Vast.ai](https://vast.ai) before committing — spot prices move daily.

## Known issues

- **Evictions on spot instances**: Save checkpoints periodically. Use on-demand (TensorDock/Lambda) for production.
- **NSFW policy**: Vast.ai is infrastructure-only — no content filtering. All VeilWick content is allowed under their ToS (no CSAM, no non-consensual real-person imagery). Cloudflare R2/KV is also permitted for adult content when age-gated.
- **Cold start**: First inference loads model weights (~30 GB) into VRAM — expect 1–2 min. Subsequent calls are fast.
- **2× 4090 for 720p+**: Long or high-res video clips may need two 4090s or a single A100.