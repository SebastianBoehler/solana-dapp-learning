import { PublicKey, clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import { createAccount, createAssociatedTokenAccount, createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import fs from 'fs';

async function mint_token() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    //payer wallet
    const secret_p = JSON.parse(fs.readFileSync('./payer.json', 'utf-8'));
    const payer = Keypair.fromSecretKey(Buffer.from(secret_p));
    console.log('payer pubkey', payer.publicKey.toBase58())

    //token
    //defines where the token mint program "lives"
    const secret_t = JSON.parse(fs.readFileSync('./token.json', 'utf-8'));
    const token = Keypair.fromSecretKey(Buffer.from(secret_t));

    const mint = new PublicKey('9rmyAtL7SQUdUMNYn6Cbpf5vTQcnCMSdnTn3DtD74ib') //await createMint(connection, payer, payer.publicKey, payer.publicKey, 9);
    console.log('mint', mint.toBase58());

    const acc = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        payer.publicKey,
    );

    console.log('acc', acc.address.toBase58());

    const mintto = await mintTo(
        connection,
        payer,
        mint,
        acc.address,
        payer.publicKey,
        200 * 10 ** 9,
    );

    console.log('mintto', mintto);

}

export default mint_token
