import { address } from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';
import { useClient, useAction } from '@solana/react';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useState } from 'react';
import type { AppClient } from '@/lib/solana/client';
import { parseUnits } from '@/lib/solana/amounts';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TransactionStatus } from './transaction-status';

export function SendSOL() {
    const client = useClient<AppClient>();
    const connected = useConnectedWallet(client);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const transaction = useAction(async (signal) => {
        if (!connected?.signer) throw new Error('Connect a signing wallet first.');
        const result = await client.sendTransaction([getTransferSolInstruction({
            source: connected.signer, destination: address(recipient), amount: parseUnits(amount, 9),
        })], { abortSignal: signal });
        return result.context.signature;
    });
    return <section className="container px-8 py-12 mx-auto space-y-4">
        <h2 className="text-3xl font-bold">Send Devnet SOL</h2>
        <div className="max-w-lg space-y-2">
            <label htmlFor="sol-recipient">Recipient address</label>
            <Input id="sol-recipient" value={recipient} onChange={e => setRecipient(e.target.value)} />
            <label htmlFor="sol-amount">Amount in SOL</label>
            <Input id="sol-amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
            <Button disabled={!connected?.signer || !recipient || !amount || transaction.isRunning} onClick={() => { void transaction.dispatch(); }}>Send SOL</Button>
        </div>
        <TransactionStatus action={transaction} />
    </section>;
}
