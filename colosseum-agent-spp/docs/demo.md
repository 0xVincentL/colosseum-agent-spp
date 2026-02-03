# Demo (MVP)

## What works today
- Submit a job to the router
- Router computes request/response hashes
- Router writes an on-chain **Memo** transaction containing the JobReceipt JSON
- UI shows the receipt + Solana explorer link for verification

## Run locally
1) Install
```bash
cd router
npm i
```

2) Provide a devnet keypair
Set one env var:
- `ROUTER_SECRET_KEY_BASE58` (base58 secret key)

3) Start router
```bash
npm run dev
# http://localhost:8789
```

4) Open demo UI
Open `web/index.html` in your browser.

## Verification
Open the explorer link from the response. The memo data contains the receipt JSON, including `requestHash` and `responseHash`.
