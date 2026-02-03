# Spec (v0)

## Problem
Agents need a primitive to collaborate across services without trusting screenshots/logs.

## Core objects (on-chain)
- Provider
  - authority (pubkey)
  - name (string)
  - endpoint (string)  // off-chain URL
  - metadata (string)  // optional JSON

- Service
  - provider (pubkey)
  - schemaHash (bytes32)
  - version (u32)
  - tags (string)
  - pricing (u64) // optional

- JobReceipt
  - provider (pubkey)
  - client (pubkey)
  - service (pubkey)
  - requestHash (bytes32)
  - responseHash (bytes32)
  - createdAt (i64)

## Flows
1) Register Provider
2) Add Service
3) Dispatch Job off-chain
4) Write JobReceipt on-chain
5) Verify receipt in UI
