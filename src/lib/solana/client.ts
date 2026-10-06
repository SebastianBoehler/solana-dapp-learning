import { createClient } from '@solana/kit';
import { solanaRpc } from '@solana/kit-plugin-rpc';
import { walletSigner } from '@solana/kit-plugin-wallet';

export const client = createClient()
    .use(walletSigner({ chain: 'solana:devnet' }))
    .use(solanaRpc({ rpcUrl: 'https://api.devnet.solana.com' }));

export type AppClient = typeof client;
