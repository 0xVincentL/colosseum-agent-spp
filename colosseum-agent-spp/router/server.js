const express = require('express');
const cors = require('cors');
const { z } = require('zod');
const crypto = require('crypto');
const bs58mod = require('bs58');
const bs58 = bs58mod.default || bs58mod;
const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');

// Memo program (no custom program needed)
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function getKeypair() {
  // Prefer base58 secret key
  const b58 = process.env.ROUTER_SECRET_KEY_BASE58;
  if (b58) {
    const bytes = bs58.decode(b58);
    return Keypair.fromSecretKey(bytes);
  }

  // Or JSON array
  const json = process.env.ROUTER_SECRET_KEY_JSON;
  if (json) {
    const arr = JSON.parse(json);
    return Keypair.fromSecretKey(Uint8Array.from(arr));
  }

  throw new Error('Missing ROUTER_SECRET_KEY_BASE58 or ROUTER_SECRET_KEY_JSON');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const Provider = z.object({
  id: z.string().min(2).max(64),
  name: z.string().min(2).max(80),
  endpoint: z.string().url().optional(),
  tags: z.array(z.string()).max(10).optional(),
});

const DispatchReq = z.object({
  providerId: z.string().min(2).max(64),
  service: z.string().min(2).max(80),
  request: z.any(),
  // optional response override
  response: z.any().optional(),
});

// In-memory registry (MVP). Swap to DB later.
const registry = {
  providers: [
    {
      id: 'xm-demo',
      name: 'XiaoM Demo Provider',
      endpoint: null,
      tags: ['ai', 'infra'],
    },
  ],
};

function getConnection() {
  const rpc = process.env.SOLANA_RPC || clusterApiUrl('devnet');
  return new Connection(rpc, 'confirmed');
}

app.get('/api/health', async (_req, res) => {
  try {
    const kp = (() => {
      try {
        return getKeypair();
      } catch {
        return null;
      }
    })();
    res.json({
      ok: true,
      network: process.env.SOLANA_RPC || 'devnet',
      hasKey: Boolean(kp),
      pubkey: kp ? kp.publicKey.toBase58() : null,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

app.get('/api/providers', (_req, res) => {
  res.json({ ok: true, providers: registry.providers });
});

app.post('/api/providers', (req, res) => {
  const parsed = Provider.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.issues });
  registry.providers.push(parsed.data);
  res.json({ ok: true, providers: registry.providers });
});

app.post('/api/airdrop', async (req, res) => {
  // Devnet only helper: airdrop to router signer
  try {
    const connection = getConnection();
    const payer = getKeypair();
    const sol = Number(req.body?.sol ?? 1);
    const sig = await connection.requestAirdrop(payer.publicKey, Math.floor(sol * LAMPORTS_PER_SOL));
    await connection.confirmTransaction(sig, 'confirmed');
    res.json({ ok: true, signature: sig, explorer: `https://explorer.solana.com/tx/${sig}?cluster=devnet` });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
});

app.post('/api/dispatch', async (req, res) => {
  const parsed = DispatchReq.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok: false, error: parsed.error.issues });

  const { providerId, service, request } = parsed.data;
  const provider = registry.providers.find((p) => p.id === providerId);
  if (!provider) return res.status(404).json({ ok: false, error: 'Unknown providerId' });

  const requestJson = JSON.stringify({ providerId, service, request });

  // MVP response: echo with timestamp (replace with real provider call later)
  const responseObj = parsed.data.response ?? {
    ok: true,
    echoed: request,
    service,
    providerId,
    ts: new Date().toISOString(),
  };
  const responseJson = JSON.stringify(responseObj);

  const requestHash = sha256Hex(requestJson);
  const responseHash = sha256Hex(responseJson);

  const receipt = {
    kind: 'JobReceipt',
    providerId,
    service,
    requestHash,
    responseHash,
    createdAt: new Date().toISOString(),
  };

  const memo = Buffer.from(JSON.stringify(receipt), 'utf8');

  try {
    const connection = getConnection();
    const payer = getKeypair();

    const ix = new TransactionInstruction({
      programId: MEMO_PROGRAM_ID,
      keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }],
      data: memo,
    });

    const tx = new Transaction().add(ix);

    const sig = await sendAndConfirmTransaction(connection, tx, [payer], {
      commitment: 'confirmed',
    });

    res.json({
      ok: true,
      provider,
      request: JSON.parse(requestJson),
      response: responseObj,
      receipt,
      solana: {
        signature: sig,
        explorer: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
      },
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e.message || e), receipt });
  }
});

const port = Number(process.env.PORT || 8789);
app.listen(port, () => {
  console.log(`agent-spp-router listening on http://localhost:${port}`);
});
