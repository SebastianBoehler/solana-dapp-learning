import { getU32Encoder, getU64Encoder, getUtf8Encoder, type TransactionSigner } from '@solana/kit';
import { oracleProgramId } from '@/config';
import { deriveAccount, programInstruction } from './anchor';

export async function oracleInstruction(signer: TransactionSigner, action: 'initialize' | 'update', price?: bigint) {
    const program = oracleProgramId();
    const account = await deriveAccount(program, 'oracle', signer.address);
    const name = getUtf8Encoder().encode('BTC/USDT');
    const args = action === 'initialize'
        ? new Uint8Array([...getU32Encoder().encode(name.length), ...name])
        : new Uint8Array(getU64Encoder().encode(price!));
    return programInstruction(program, action, signer, account, args, action === 'initialize');
}
