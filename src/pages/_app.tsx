import type { AppProps } from 'next/app'
import { ConnectionProvider, WalletProvider, useAnchorWallet } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import "@solana/wallet-adapter-react-ui/styles.css"
import { useEffect, useMemo, useState } from 'react'
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function MyApp({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = useState(false)
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

    useEffect(() => {
        setMounted(true)
    }, [])

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);


    return <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                {mounted && (<Component {...pageProps} />)}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
}
