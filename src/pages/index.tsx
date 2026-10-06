import React from 'react';
import { SendSOL } from '@/components/sendLamports';
import { Counter } from '@/components/counter';
import { PythSendUsd } from '@/components/pyth_send_usd';
import { Header } from '@/components/header';
import { Oracle } from '@/components/oracle';

const IndexPage: React.FC = () => {
    return (
        <div>
            <Header />
            <SendSOL />
            <PythSendUsd />
            <Counter />
            <Oracle />
        </div>
    );
};

export default IndexPage;
