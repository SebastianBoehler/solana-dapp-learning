import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'

const IndexPage: React.FC = () => {
    return (
        <div>
            <div className="flex justify-end mr-8 mt-8">
                <div>
                    <WalletMultiButton style={{ backgroundColor: 'midnightblue' }} />
                </div>
            </div>
            <Counter />
        </div>
    );
};

export default IndexPage;
