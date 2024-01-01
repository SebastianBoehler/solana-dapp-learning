import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'
import { PythSendUsd } from '@/components/pyth_send_usd';
import { Header } from '@/components/header';
import { Oracle } from '@/components/oracle';

const IndexPage: React.FC = () => {
    return (
        <div>
            <Header />
            <PythSendUsd />
            <Counter />
            <Oracle />
        </div>
    );
};

export default IndexPage;
