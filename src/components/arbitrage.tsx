import { ErrorMessage } from './error-message';
import { useAction } from '@solana/react';
import { useState } from 'react';
import { parseUnits } from '@/lib/solana/amounts';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface RoundTrip { input: string; usdc: string; output: string; difference: string; routers: string[] }

export function Arbitrage() {
    const [amount, setAmount] = useState('');
    const quote = useAction(async () => {
        const query = new URLSearchParams({ amount: parseUnits(amount, 9).toString() });
        const response = await fetch(`/api/round-trip?${query}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data as RoundTrip;
    });
    return <section className="container px-8 py-12 mx-auto space-y-4">
        <h1 className="text-3xl font-bold">Compare a SOL → USDC → SOL round trip</h1>
        <p>Jupiter V2 quotes use Mainnet market data. This page does not sign or execute swaps.</p>
        <p>Sequential quotes are not an atomic route. Their difference excludes execution costs and does not establish arbitrage profit.</p>
        <div className="max-w-lg space-y-2">
            <label htmlFor="quote-amount">Input SOL</label>
            <Input id="quote-amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
            <Button disabled={!amount || quote.isRunning} onClick={() => { void quote.dispatch(); }}>Compare quotes</Button>
        </div>
        {quote.isRunning && <p aria-live="polite">Requesting quotes…</p>}
        <ErrorMessage error={quote.error} />
        {quote.data && <dl className="space-y-2">
            <dt>Input lamports</dt><dd>{quote.data.input}</dd>
            <dt>USDC output (base units)</dt><dd>{quote.data.usdc}</dd>
            <dt>Return lamports</dt><dd>{quote.data.output}</dd>
            <dt>Quoted difference (lamports)</dt><dd>{quote.data.difference}</dd>
        </dl>}
    </section>;
}
