import { getBase64Encoder, type Address, type TransactionSigner } from '@solana/kit';
import { counterProgramId } from '@/config';
import { deriveAccount, discriminator, programInstruction } from './anchor';
import type { AppClient } from '@/lib/solana/client';

export async function readCounter(client: AppClient, user: Address) {
    const program = counterProgramId();
    const account = await deriveAccount(program, 'counter', user);
    const { value } = await client.rpc.getAccountInfo(account, { encoding: 'base64', commitment: 'confirmed' }).send();
    if (!value) return { account, count: null };
    const data = getBase64Encoder().encode(value.data[0]);
    const expected = await discriminator('account', 'Counter');
    if (value.owner !== program || data.length !== 9 || !expected.every((byte, i) => data[i] === byte)) {
        throw new Error('Account does not match the counter program.');
    }
    return { account, count: data[8] };
}

export async function counterInstruction(signer: TransactionSigner, action: 'initialize' | 'increase_counter' | 'decrease_counter' | 'close_counter_pda') {
    const program = counterProgramId();
    const account = await deriveAccount(program, 'counter', signer.address);
    const args = action === 'increase_counter' || action === 'decrease_counter' ? new Uint8Array([4]) : undefined;
    return programInstruction(program, action, signer, account, args, action === 'initialize' || action === 'close_counter_pda');
}
