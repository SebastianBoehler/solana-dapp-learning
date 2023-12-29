import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'
import { PythSendUsd } from '@/components/pyth_send_usd';
import { Header } from '@/components/header';

const IndexPage: React.FC = () => {
    return (
        <div>
            <Header />
            <PythSendUsd />
            <Counter />
        </div>
    );
};

export default IndexPage;
