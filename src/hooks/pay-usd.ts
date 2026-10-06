import { AccountRole, getU64Encoder, type Address, type Instruction, type TransactionSigner } from '@solana/kit';
import { SYSTEM_PROGRAM_ADDRESS } from '@solana-program/system';
import { payUsdProgramId, priceUpdateAccount } from '@/config';
import { discriminator } from './anchor';

export async function payUsdInstruction(signer: TransactionSigner, recipient: Address, cents: bigint) {
    return {
        programAddress: payUsdProgramId(),
        data: new Uint8Array([...await discriminator('global', 'pay_usd'), ...getU64Encoder().encode(cents)]),
        accounts: [
            { address: signer.address, role: AccountRole.WRITABLE_SIGNER, signer },
            { address: recipient, role: AccountRole.WRITABLE },
            { address: priceUpdateAccount(), role: AccountRole.READONLY },
            { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
        ],
    };
}
