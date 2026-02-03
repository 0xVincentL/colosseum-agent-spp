# Agent SPP on Solana (Hackathon)

Goal: build a minimal **Agent Service Provider Platform (SPP)** on Solana:
- **Registry**: providers + services + versions
- **JobReceipt**: on-chain receipt anchoring request/response hashes (verifiable audit trail)
- **Router**: off-chain dispatcher that writes receipts and serves a simple API
- **Demo UI**: invoke a provider and verify receipts

## MVP (Hackathon)
- Anchor program: Provider, Service, JobReceipt accounts
- Router (Node/TS): register, dispatch, create receipt
- Web: list providers, create job, show receipt + explorer link

## Non-goals (for now)
- No private keys in frontend
- No automatic trading execution
- No custodial funds

## Milestones
- Day 0: project skeleton + spec
- Day 1: Anchor program compiles + basic instructions
- Day 2: router can create Provider/Service + JobReceipt
- Day 3: demo UI end-to-end
