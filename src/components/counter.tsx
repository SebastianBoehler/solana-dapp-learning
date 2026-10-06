import { ErrorMessage } from './error-message';
import { useClient, useAction } from '@solana/react';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useEffect, useState } from 'react';
import type { AppClient } from '@/lib/solana/client';
import { counterInstruction, readCounter } from '@/hooks/counter';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { TransactionStatus } from './transaction-status';

export function Counter() {
    const client = useClient<AppClient>();
    const connected = useConnectedWallet(client);
    const [count, setCount] = useState<number | null>(null);
    const load = useAction(async (signal) => {
        if (!connected?.signer) return;
        const result = await readCounter(client, connected.signer.address);
        signal.throwIfAborted();
        setCount(result.count);
    });
    const transaction = useAction(async (signal, action: Parameters<typeof counterInstruction>[1]) => {
        if (!connected?.signer) throw new Error('Connect a signing wallet first.');
        const instruction = await counterInstruction(connected.signer, action);
        const result = await client.sendTransaction([instruction], { abortSignal: signal });
        signal.throwIfAborted();
        await load.dispatchAsync();
        return result.context.signature;
    });
    useEffect(() => { setCount(null); load.reset(); transaction.reset(); }, [connected?.account.address]);
    const disabled = !connected?.signer || transaction.isRunning || load.isRunning;
    return <section className="container px-8 py-12 mx-auto space-y-4">
        <h2 className="text-3xl font-bold">Create and manage your counter</h2>
        <p>An Anchor program stores one counter per wallet in a program derived address (PDA).</p>
        <Card><CardContent className="p-4 space-y-4">
            <p>Current count: {count === null ? 'Load your account to check' : count}</p>
            <div className="flex flex-wrap gap-2">
                <Button disabled={disabled} onClick={() => { void load.dispatch(); }}>Load counter</Button>
                <Button disabled={disabled || count !== null} onClick={() => { void transaction.dispatch('initialize'); }}>Initialize</Button>
                <Button disabled={disabled || count === null || count > 251} onClick={() => { void transaction.dispatch('increase_counter'); }}>Increase by 4</Button>
                <Button disabled={disabled || count === null || count < 4} onClick={() => { void transaction.dispatch('decrease_counter'); }}>Decrease by 4</Button>
                <Button disabled={disabled || count === null} onClick={() => { void transaction.dispatch('close_counter_pda'); }}>Close account</Button>
            </div>
            <ErrorMessage error={load.error} />
            <TransactionStatus action={transaction} />
        </CardContent></Card>
    </section>;
}
