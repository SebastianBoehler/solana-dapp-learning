import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'

const IndexPage: React.FC = () => {

    return (
        <div className='px-12'>
            <div className="flex justify-end py-8">
                <div className="ml-4">
                    <WalletMultiButton style={{ backgroundColor: 'midnightblue' }} />
                </div>
            </div>
            <Counter />
        </div>
    );
};

export default IndexPage;
