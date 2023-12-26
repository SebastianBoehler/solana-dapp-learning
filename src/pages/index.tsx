import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'

const IndexPage: React.FC = () => {

    return (
        <div>
            <div className="flex justify-end p-4">
                <div className="ml-4">
                    <WalletMultiButton style={{ backgroundColor: 'lightblue' }} />
                </div>
            </div>
            <Counter />
        </div>
    );
};

export default IndexPage;
