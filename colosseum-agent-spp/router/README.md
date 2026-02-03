# Router (MVP)

Off-chain dispatcher + on-chain receipts via Solana **Memo** program.

## Why Memo?
No custom Rust/Anchor toolchain required for the MVP, but still produces a verifiable on-chain receipt.

## Setup
1) Install deps
```bash
npm i
```

2) Provide a devnet keypair

Export one of:
- `ROUTER_SECRET_KEY_BASE58` (base58-encoded 64-byte secret key)
- `ROUTER_SECRET_KEY_JSON` (JSON array secret key)

3) Run
```bash
npm run dev
# listens on :8789
```

## Endpoints
- `GET /api/health`
- `GET /api/providers`
- `POST /api/dispatch`

Example dispatch:
```bash
curl -X POST http://localhost:8789/api/dispatch \
  -H 'Content-Type: application/json' \
  -d '{"providerId":"xm-demo","service":"echo","request":{"msg":"hello"}}'
```

Response includes `receipt` and a Solana explorer link for the memo transaction.
