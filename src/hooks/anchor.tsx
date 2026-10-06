import {
    AccountRole, getAddressEncoder, getProgramDerivedAddress,
    getUtf8Encoder, type Address, type Instruction, type TransactionSigner,
} from '@solana/kit';
import { SYSTEM_PROGRAM_ADDRESS } from '@solana-program/system';

// Anchor instruction identifiers are the first eight bytes of SHA-256.
export async function discriminator(namespace: 'global' | 'account', name: string) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${namespace}:${name}`));
    return new Uint8Array(digest).slice(0, 8);
}

export async function deriveAccount(programAddress: Address, seed: 'counter' | 'oracle', user: Address) {
    const [pda] = await getProgramDerivedAddress({
        programAddress,
        seeds: [getUtf8Encoder().encode(seed), getAddressEncoder().encode(user)],
    });
    return pda;
}

export async function programInstruction(
    programAddress: Address, name: string, signer: TransactionSigner,
    account: Address, args: Uint8Array = new Uint8Array(),
    includeSystem = false,
) {
    const prefix = await discriminator('global', name);
    const data = new Uint8Array(prefix.length + args.length);
    data.set(prefix);
    data.set(args, prefix.length);
    return {
        programAddress, data,
        accounts: [
            { address: signer.address, role: AccountRole.WRITABLE_SIGNER, signer },
            { address: account, role: AccountRole.WRITABLE },
            ...(includeSystem ? [{ address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY }] : []),
        ],
    };
}
