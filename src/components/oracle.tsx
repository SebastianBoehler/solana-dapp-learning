import { useClient, useAction } from '@solana/react';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useEffect, useState } from 'react';
import type { AppClient } from '@/lib/solana/client';
import { oracleInstruction } from '@/hooks/oracle';
import { Button } from './ui/button';
import { TransactionStatus } from './transaction-status';

export function Oracle() {
    const client = useClient<AppClient>();
    const connected = useConnectedWallet(client);
    const [price, setPrice] = useState<number | null>(null);
    const [streamError, setStreamError] = useState('');
    useEffect(() => {
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
        ws.onmessage = event => {
            try {
                const value = Number(JSON.parse(event.data).c);
                if (!Number.isFinite(value) || value <= 0) throw new Error('Invalid exchange price.');
                setPrice(value);
                setStreamError('');
            } catch { setPrice(null); setStreamError('Could not parse the exchange price.'); }
        };
        ws.onerror = () => { setPrice(null); setStreamError('Exchange stream connection failed.'); };
        ws.onclose = () => { setPrice(null); setStreamError('Exchange stream disconnected.'); };
        return () => { ws.onclose = null; ws.close(); };
    }, []);
    const transaction = useAction(async (signal, action: 'initialize' | 'update') => {
        if (!connected?.signer) throw new Error('Connect a signing wallet first.');
        if (action === 'update' && price === null) throw new Error('Wait for a valid exchange price.');
        const instruction = await oracleInstruction(connected.signer, action, BigInt(Math.round((price || 0) * 1000)));
        const result = await client.sendTransaction([instruction], { abortSignal: signal });
        return result.context.signature;
    });
    return <section className="container px-8 py-12 mx-auto space-y-4">
        <h2 className="text-3xl font-bold">Write an exchange price on chain</h2>
        <p>BTC/USDT: {price === null ? 'Waiting for stream' : price.toFixed(2)}</p>
        <p>Your wallet writes a single value in thousandths. This demonstrates a user-controlled data store, not a verified price oracle.</p>
        <div className="flex gap-2">
            <Button disabled={!connected?.signer || transaction.isRunning} onClick={() => { void transaction.dispatch('initialize'); }}>Initialize data store</Button>
            <Button disabled={!connected?.signer || price === null || transaction.isRunning} onClick={() => { void transaction.dispatch('update'); }}>Write current price</Button>
        </div>
        {streamError && <p role="alert">{streamError}</p>}
        <TransactionStatus action={transaction} />
    </section>;
}
