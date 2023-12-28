import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './style.css'
import { PythSendUsd } from '@/components/pyth_send_usd';

const IndexPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-end mr-8 mt-8">
                <div>
                    <WalletMultiButton style={{ backgroundColor: 'midnightblue' }} />
                </div>
            </div>
            <PythSendUsd />
        </div>
    );
};

export default IndexPage;
