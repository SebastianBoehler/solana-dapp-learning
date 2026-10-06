import type { NextApiRequest, NextApiResponse } from 'next';
import { HermesClient } from '@pythnetwork/hermes-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.setHeader('Allow', 'GET').status(405).json({ error: 'Use GET.' });
    res.setHeader('Cache-Control', 'no-store');
    if (!process.env.PYTH_API_KEY) return res.status(503).json({ error: 'Set the server-only PYTH_API_KEY to read Hermes prices.' });
    try {
        const hermes = new HermesClient('https://pyth.dourolabs.app/hermes', {
            headers: { Authorization: `Bearer ${process.env.PYTH_API_KEY}` },
        });
        const result = await hermes.getLatestPriceUpdates([
            'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
        ], { parsed: true }, { signal: AbortSignal.timeout(10_000) });
        const price = result.parsed?.[0]?.price;
        if (!price || BigInt(price.price) <= 0n || price.publish_time < Date.now() / 1000 - 60) {
            throw new Error('Missing, invalid, or stale SOL/USD price.');
        }
        return res.status(200).json(price);
    } catch (error) {
        console.error('Hermes price request failed', error instanceof Error ? error.message : 'Unknown error');
        return res.status(502).json({ error: 'Hermes price request failed. Check the server API key and service availability.' });
    }
}
