import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Counter } from '@/components/counter';
import './style.css'

const ArbitragePage: React.FC = () => {

    return (
        <div>
            <div className="flex justify-end p-4">
                <div className="ml-4">
                    <WalletMultiButton style={{ backgroundColor: 'midnightblue' }} />
                </div>
            </div>
        </div>
    );
};

export default ArbitragePage;
