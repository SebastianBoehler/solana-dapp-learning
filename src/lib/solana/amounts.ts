export function parseUnits(value: string, decimals: number): bigint {
    if (!/^\d+(\.\d+)?$/.test(value)) throw new Error('Enter a positive decimal amount.');
    const [whole, fraction = ''] = value.split('.');
    if (fraction.length > decimals) throw new Error(`Use at most ${decimals} decimal places.`);
    const units = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction.padEnd(decimals, '0'));
    if (units <= 0n || units > 18446744073709551615n) throw new Error('Amount is outside the positive u64 range.');
    return units;
}
