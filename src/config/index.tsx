import { address } from '@solana/kit';

export function counterProgramId() {
    if (!process.env.NEXT_PUBLIC_COUNTER_PROGRAM_ID) {
        throw new Error('Set NEXT_PUBLIC_COUNTER_PROGRAM_ID to your deployed Devnet counter program.');
    }
    return address(process.env.NEXT_PUBLIC_COUNTER_PROGRAM_ID);
}

export function oracleProgramId() {
    if (!process.env.NEXT_PUBLIC_ORACLE_PROGRAM_ID) {
        throw new Error('Set NEXT_PUBLIC_ORACLE_PROGRAM_ID to your deployed Devnet oracle program.');
    }
    return address(process.env.NEXT_PUBLIC_ORACLE_PROGRAM_ID);
}

export function payUsdProgramId() {
    if (!process.env.NEXT_PUBLIC_PAY_USD_PROGRAM_ID) {
        throw new Error('Set NEXT_PUBLIC_PAY_USD_PROGRAM_ID to your deployed Devnet payment program.');
    }
    return address(process.env.NEXT_PUBLIC_PAY_USD_PROGRAM_ID);
}

export function priceUpdateAccount() {
    if (!process.env.NEXT_PUBLIC_SOL_USD_PRICE_ACCOUNT) {
        throw new Error('Set NEXT_PUBLIC_SOL_USD_PRICE_ACCOUNT to a current Pyth SOL/USD Devnet price update account.');
    }
    return address(process.env.NEXT_PUBLIC_SOL_USD_PRICE_ACCOUNT);
}
