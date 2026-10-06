import { generateKeyPairSigner, type TransactionSigner } from '@solana/kit';
import { getCreateAccountInstruction } from '@solana-program/system';
import {
    TOKEN_PROGRAM_ADDRESS, findAssociatedTokenPda, getMintSize,
    getCreateAssociatedTokenInstruction, getInitializeMint2Instruction, getMintToInstruction,
} from '@solana-program/token';
import type { AppClient } from '@/lib/solana/client';

// Call from a connected Devnet wallet. No filesystem secrets or shared mint.
export async function mintToken(client: AppClient, payer: TransactionSigner) {
    const mint = await generateKeyPairSigner();
    const [ata] = await findAssociatedTokenPda({ owner: payer.address, mint: mint.address, tokenProgram: TOKEN_PROGRAM_ADDRESS });
    const space = getMintSize();
    const lamports = await client.rpc.getMinimumBalanceForRentExemption(BigInt(space)).send();
    const result = await client.sendTransaction([
        getCreateAccountInstruction({ payer, newAccount: mint, lamports, space, programAddress: TOKEN_PROGRAM_ADDRESS }),
        getInitializeMint2Instruction({ mint: mint.address, decimals: 9, mintAuthority: payer.address, freezeAuthority: null }),
        getCreateAssociatedTokenInstruction({ payer, ata, owner: payer.address, mint: mint.address }),
        getMintToInstruction({ mint: mint.address, token: ata, mintAuthority: payer, amount: 200_000_000_000n }),
    ]);
    return { mint: mint.address, account: ata, signature: result.context.signature };
}
