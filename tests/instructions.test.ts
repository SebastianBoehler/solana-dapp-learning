import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { AccountRole, address, createNoopSigner } from '@solana/kit';
import { counterInstruction } from '../src/hooks/counter';
import { oracleInstruction } from '../src/hooks/oracle';
import { payUsdInstruction } from '../src/hooks/pay-usd';

const signer = createNoopSigner(address('11111111111111111111111111111111'));
process.env.NEXT_PUBLIC_COUNTER_PROGRAM_ID = '53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w';
process.env.NEXT_PUBLIC_ORACLE_PROGRAM_ID = 'CR651qrjHq9v18JC9qqzHZcFThFTa9dycHXofxxFcotn';
process.env.NEXT_PUBLIC_PAY_USD_PROGRAM_ID = 'SwaoHArzRjzX16rctWM6EdeFBWHbitv91H3QuwELeyd';
process.env.NEXT_PUBLIC_SOL_USD_PRICE_ACCOUNT = '11111111111111111111111111111111';
const prefix = (name: string) => createHash('sha256').update(`global:${name}`).digest().subarray(0, 8);

test('counter ABI encodes u8 steps and includes the wallet authority', async () => {
    for (const name of ['increase_counter', 'decrease_counter'] as const) {
        const ix = await counterInstruction(signer, name);
        assert.deepEqual(Buffer.from(ix.data), Buffer.concat([prefix(name), Buffer.from([4])]));
        assert.equal(ix.accounts[0].address, signer.address);
        assert.equal(ix.accounts[0].role, AccountRole.WRITABLE_SIGNER);
        assert.equal(ix.accounts[1].role, AccountRole.WRITABLE);
    }
    const close = await counterInstruction(signer, 'close_counter_pda');
    assert.equal(close.accounts.length, 3);
    assert.equal(close.accounts[0].role, AccountRole.WRITABLE_SIGNER);
});

test('oracle initializer encodes the name; update encodes only u64 data', async () => {
    const initialize = await oracleInstruction(signer, 'initialize');
    const name = Buffer.from('BTC/USDT');
    const length = Buffer.alloc(4); length.writeUInt32LE(name.length);
    assert.deepEqual(Buffer.from(initialize.data), Buffer.concat([prefix('initialize'), length, name]));
    const value = 123456789012345n;
    const bytes = Buffer.alloc(8); bytes.writeBigUInt64LE(value);
    const update = await oracleInstruction(signer, 'update', value);
    assert.deepEqual(Buffer.from(update.data), Buffer.concat([prefix('update'), bytes]));
});

test('Pyth payment passes cents and a read-only price update', async () => {
    const instruction = await payUsdInstruction(signer, address('11111111111111111111111111111111'), 1234n);
    const bytes = Buffer.alloc(8); bytes.writeBigUInt64LE(1234n);
    assert.deepEqual(Buffer.from(instruction.data), Buffer.concat([prefix('pay_usd'), bytes]));
    assert.equal(instruction.accounts.length, 4);
    assert.equal(instruction.accounts[2].role, AccountRole.READONLY);
    assert.equal(instruction.accounts[0].role, AccountRole.WRITABLE_SIGNER);
});
