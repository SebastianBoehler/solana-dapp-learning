import { parseUnits } from './solana/amounts';

export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export async function getOrder(inputMint: string, outputMint: string, amount: string, apiKey: string) {
    parseUnits(amount, 0);
    const query = new URLSearchParams({ inputMint, outputMint, amount });
    const response = await fetch(`https://api.jup.ag/swap/v2/order?${query}`, {
        headers: { 'x-api-key': apiKey }, signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Jupiter returned HTTP ${response.status}.`);
    const order = await response.json();
    if (order.errorCode || typeof order.outAmount !== 'string' || !/^\d+$/.test(order.outAmount)) {
        throw new Error('Jupiter returned an invalid quote.');
    }
    parseUnits(order.outAmount, 0);
    return { outAmount: order.outAmount as string, router: order.router as string };
}
