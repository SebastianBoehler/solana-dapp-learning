import { ErrorMessage } from './error-message';
import { useClient } from '@solana/react';
import { useConnect, useConnectedWallet, useDisconnect, useWallets } from '@solana/kit-plugin-wallet/react';
import type { AppClient } from '@/lib/solana/client';
import { Button } from './ui/button';

export function WalletButton() {
    const client = useClient<AppClient>();
    const wallets = useWallets(client);
    const connected = useConnectedWallet(client);
    const connect = useConnect(client);
    const disconnect = useDisconnect(client);
    const error = connect.error || disconnect.error;
    return <div className="space-y-2">
        {connected ? <>
            <p className="text-sm break-all">{connected.account.address}</p>
            <Button disabled={disconnect.isRunning} onClick={() => { void disconnect.dispatch(); }}>Disconnect</Button>
        </> : wallets.length ? wallets.map(wallet =>
            <Button key={wallet.name} disabled={connect.isRunning} onClick={() => { void connect.dispatch(wallet); }}>
                Connect {wallet.name}
            </Button>
        ) : <p>Install a Wallet Standard wallet and select Devnet.</p>}
        <ErrorMessage error={error} />
    </div>;
}
