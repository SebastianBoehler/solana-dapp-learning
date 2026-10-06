import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUnits } from '../src/lib/solana/amounts';

test('SOL and USD amounts preserve exact base units', () => {
    assert.equal(parseUnits('0.000000001', 9), 1n);
    assert.equal(parseUnits('12.34', 2), 1234n);
    assert.equal(parseUnits('18446744073709551615', 0), 18446744073709551615n);
});

test('invalid, fractional base units, zero, and overflow fail', () => {
    for (const value of ['0', '-1', 'NaN', 'Infinity', '1e2', '1.234', '18446744073709551616']) {
        assert.throws(() => parseUnits(value, 2));
    }
    assert.throws(() => parseUnits('0.0000000001', 9));
});
