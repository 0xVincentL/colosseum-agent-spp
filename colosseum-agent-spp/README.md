# Agent SPP on Solana (Hackathon)

Goal: build a minimal **Agent Service Provider Platform (SPP)** on Solana:
- **Registry**: providers + services + versions
- **JobReceipt**: on-chain receipt anchoring request/response hashes (verifiable audit trail)
- **Router**: off-chain dispatcher that writes receipts and serves a simple API
- **Demo UI**: invoke a provider and verify receipts

## Demo (MVP)

### What you can verify on-chain
This MVP uses the Solana **Memo** program to write a `JobReceipt` JSON on-chain.
The receipt contains:
- `requestHash` (sha256)
- `responseHash` (sha256)
- `providerId`, `service`, timestamp

### Run router
```bash
cd router
npm i

# set one of:
# ROUTER_SECRET_KEY_BASE58=...
# ROUTER_SECRET_KEY_JSON='[ ... ]'

npm run dev
# http://localhost:8789
```

### Run UI
Open `web/index.html` in a browser, set Router URL, then click **Dispatch + Write Receipt**.
It returns a Solana explorer link for the transaction.

## MVP scope (Hackathon)
- **On-chain receipt**: write a JobReceipt to Solana via Memo program (verifiable tx)
- Router (Node): register (in-memory), dispatch (echo provider), create receipt
- Web: create job, show receipt + Solana explorer link

## Non-goals (for now)
- No private keys in frontend
- No automatic trading execution
- No custodial funds

## Milestones
- Today: end-to-end demo (router + web + on-chain receipt)
- Next: provider discovery, service schema hashes, optional settlement
