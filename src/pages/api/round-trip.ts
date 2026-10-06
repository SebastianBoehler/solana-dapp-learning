import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrder, SOL_MINT, USDC_MINT } from '@/lib/jupiter';
import { parseUnits } from '@/lib/solana/amounts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.setHeader('Allow', 'GET').status(405).json({ error: 'Use GET.' });
    res.setHeader('Cache-Control', 'no-store');
    const amount = req.query.amount;
    try {
        if (typeof amount !== 'string') throw new Error('Enter a whole number of lamports.');
        parseUnits(amount, 0);
    } catch (error) { return res.status(400).json({ error: (error as Error).message }); }
    if (!process.env.JUPITER_API_KEY) return res.status(503).json({ error: 'Set the server-only JUPITER_API_KEY to request quotes.' });
    try {
        const forward = await getOrder(SOL_MINT, USDC_MINT, amount as string, process.env.JUPITER_API_KEY);
        const reverse = await getOrder(USDC_MINT, SOL_MINT, forward.outAmount, process.env.JUPITER_API_KEY);
        return res.status(200).json({ input: amount, usdc: forward.outAmount, output: reverse.outAmount,
            difference: (BigInt(reverse.outAmount) - BigInt(amount as string)).toString(),
            routers: [forward.router, reverse.router] });
    } catch (error) {
        console.error('Jupiter quote request failed', error instanceof Error ? error.message : 'Unknown error');
        return res.status(502).json({ error: 'Jupiter quote request failed. Check the server API key and service availability.' });
    }
}
