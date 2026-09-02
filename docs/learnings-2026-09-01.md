# VeilWick Learnings 2026-09-01 — local 8788, not billed now

## Costs
- Wavespeed H3 image-to-video-lora $0.25 /5s 768p → 720×1280 lanczos, 74s avg, 6×$0.25=$1.50 30s 7.4M 720×1280 31.08s 9m43s total
- H3 reference-to-video-lora $0.30 /5s 9 refs better face lock, r2v test 1.2M raw 2.5M
- Wan 2.7 text-to-image $0.02-0.03 stills 720×1280, HF down, router not supported
- Vast 4090 $0.12-0.42/hr spot, 2×4090 $0.247 CN blocked US→CN ssh timed out, BC CA $0.423 created, NO $0.14 created — all destroyed 0 instances after $0 billing stopped
- Ubicloud $0.32/hr flat managed, not used; Dell via Tailscale free but tailscale CLI not found

## What worked
- Single Episode Your New Stepsister E1 Unpacking 6 scenes setup→afterglow Heat 2-3 clothed 720×1280 + engine codified 5 steps Anubis 12 T2I → Wan t2i Red lora → first/last → Anubis i2v → H3 reference 9 refs $0.30 → stitch 30s, per-scene LoRAs 282L S1-6 MMH3 + POV/cowgirl scale0.8 max3, aicamera 18 moves, candy 30+ 58-66s, short-drama 229L production.json
- Feed TikTok 100vh 8 videos buffer<2 prefetch hasMore/nextOffset, series 5-ep E1-2 free E3-5 locked, prototype-scenes 1×6 728L Single Episode 4 Heat 4 2 e1-30s 200 after 15:47 worker, chat UI /chat 4.35kB built but 404 until restart
- NSFW foundation docs/nsfw-foundation.md 9659 swappable Heat 4 placeholder 12 PASTE YOUR HEAT 4 720×1280 you fill via Mini 8B → docs/nsfw-prompts.local.md 600 gitignored, engine reuse Heat 2-3
- Audit feed/auth/series 3 docs + queue fix real H3 + poster, cdbbb8d main → pooriaarab/veilwick pushed

## What failed / needs
- 8788 workerd hangs 85627→31327→ down, needs pkill workerd + wrangler dev --local restart, chat 404 until worker reload
- Vast CN blocked, US stock dry 1×4090 0 US/CA, need poll US or Dell Mini 8B free, Anubis Mini 8B not yet running → Heat 4 you
- MMH3 lora fetch failed 1d6e43cd prompt-only, need API not CDN upload, lora scale 0.8 fix done but not tested

## Next
- Restart 8788, verify open http://localhost:8788/prototype-scenes (1×6) + /chat 200 + /prototype/e1-30s.mp4 31s + /api/feed 8
- Rent US 1×5090/1×4090 for Mini 8B when US stock, install llama.cpp Mini 8B Q8, fill Heat 4 12 → H3 → wide library, then E2 30s 6×5s $1.50
