# H3 Fast Generation Checkpoint

## Wan vs H3

| | Wan 2.4 14B | Minimax H3 / Hailuo 33B |
|---|---|---|
| Params | 14B | 33B |
| Time | 2-3 min | **5s** |
| Quality | High, general LoRA | Fast, DreamBooth per-user |
| Use | Fallback / low-affinity | Primary when affinity > 0.6 |

H3 wins on latency (24-36× faster). Wan is higher fidelity for cold / low-affinity users.

## Routing

```
affinity(topCategory) > 0.6?
  yes → H3 DreamBooth (user × topCategory, e.g. cowgirl)
  no  → Wan 2.4
  H3 failure → Wan fallback (catch + generateWanVideo)
```

- DreamBooth LoRA: trained per user via `POST /v1/video_generation/train` (H3 API, `MINIMAX_API_KEY`). Triggered on first cross of 0.6. Reused thereafter.
- Categories: `cowgirl`, `blowjob`, `missionary`, etc. — top affinity decides LoRA.
- Jobs: `h3.generate` (primary) + `wan.generate` (fallback). Queue consumer handles both.

## GPU Selection

1. Check Ubicloud: `grep UBICLOUD_API_KEY ~/.config/personal-os/secrets.env`
   - If set → use Ubicloud managed GPU (preferred, no spot eviction).
   - Currently **not set** (only `NOTION_TOKEN` present) → skip.
2. Else → **Vast.ai**.
   - Existing Wan: 4090 ~$0.30/hr (on-demand, `HF_TOKEN=hf_iKT…`).
   - Workers bundle: **47131036 — 4090D $0.11/hr** (spot, cheapest; use for workers/batch).
   - Recommendation: Vast `47131036` for dev/workers, TensorDock $0.42 flat for prod if evictions matter.

## Secrets

- `MINIMAX_API_KEY` — H3 (`.dev.vars` / `wrangler secret`)
- `HF_TOKEN=hf_iKT…` — Wan HF Inference
- `VAST_API_KEY` + `VAST_INSTANCE_IP` — Vast self-hosted Wan fallback
- `UBICLOUD_API_KEY` — checked in `~/.config/personal-os/secrets.env`; absent → Vast

## Files

- `apps/web/src/lib/h3.ts` — H3 client + DreamBooth + fallback
- `apps/web/src/lib/wan.ts` — Wan fallback (unchanged)
- `packages/shared/src/domain/generation.ts` — `shouldUseH3` / `pickBackend` (>0.6)
- `packages/jobs/src/h3-jobs.ts` + `workers/queue-consumer` — `h3.generate` handler
