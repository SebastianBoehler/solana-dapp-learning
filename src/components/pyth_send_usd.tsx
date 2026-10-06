import { ErrorMessage } from './error-message';
import { address } from '@solana/kit';
import { useClient, useAction } from '@solana/react';
import { useConnectedWallet } from '@solana/kit-plugin-wallet/react';
import { useState } from 'react';
import type { AppClient } from '@/lib/solana/client';
import { parseUnits } from '@/lib/solana/amounts';
import { payUsdInstruction } from '@/hooks/pay-usd';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TransactionStatus } from './transaction-status';

export function PythSendUsd() {
    const client = useClient<AppClient>();
    const connected = useConnectedWallet(client);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const transaction = useAction(async (signal) => {
        if (!connected?.signer) throw new Error('Connect a signing wallet first.');
        const instruction = await payUsdInstruction(connected.signer, address(recipient), parseUnits(amount, 2));
        const result = await client.sendTransaction([instruction], { abortSignal: signal });
        return result.context.signature;
    });
    const price = useAction(async () => {
        const response = await fetch('/api/price');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data as { price: string; expo: number; publish_time: number };
    });
    return <section className="container px-8 py-12 mx-auto space-y-4">
        <h2 className="text-3xl font-bold">Pay a USD amount with Devnet SOL</h2>
        <p>The program checks Pyth ownership, SOL/USD feed, verification, and a maximum price age of 60 seconds.</p>
        <p>Deploy the payment program and configure a fresh Pyth Devnet price update account before sending.</p>
        <div className="max-w-lg space-y-2">
            <label htmlFor="usd-recipient">Recipient address</label>
            <Input id="usd-recipient" value={recipient} onChange={e => setRecipient(e.target.value)} />
            <label htmlFor="usd-amount">Amount in USD (up to two decimals)</label>
            <Input id="usd-amount" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} />
            <Button disabled={!connected?.signer || !recipient || !amount || transaction.isRunning} onClick={() => { void transaction.dispatch(); }}>Send Devnet payment</Button>
        </div>
        <TransactionStatus action={transaction} />
        <Button disabled={price.isRunning} onClick={() => { void price.dispatch(); }}>Read Hermes price</Button>
        <ErrorMessage error={price.error} />
        {price.data && <p>Hermes preview: {(Number(price.data.price) * 10 ** price.data.expo).toFixed(2)} USD/SOL.
            This read does not publish an on-chain update.</p>}
    </section>;
}
