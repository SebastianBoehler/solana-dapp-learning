import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ClientProvider } from '@solana/react';
import { client } from '@/lib/solana/client';
import './style.css';

export default function MyApp({ Component, pageProps }: AppProps) {
    return <ClientProvider client={client}>
        <Head><title>Solana DApp Learning</title>
            <meta name="description" content="Learn Solana with Devnet wallet, transfer, counter, and oracle examples." />
        </Head>
        <Component {...pageProps} />
    </ClientProvider>;
}
