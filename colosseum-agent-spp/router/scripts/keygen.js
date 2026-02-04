const { Keypair } = require('@solana/web3.js');
const bs58mod = require('bs58');
const bs58 = bs58mod.default || bs58mod;

const kp = Keypair.generate();
console.log('PUBLIC_KEY=' + kp.publicKey.toBase58());
console.log('ROUTER_SECRET_KEY_BASE58=' + bs58.encode(kp.secretKey));
