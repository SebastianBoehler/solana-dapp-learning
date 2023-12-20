import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { SendSOLToRandomAddress } from '@/components/sendLamports';
import { HelloWorld } from '@/components/callOwnProgram';

const IndexPage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to my Solana Dapp Learning!</h1>
            <WalletMultiButton />
            <SendSOLToRandomAddress />
            <HelloWorld />
        </div>
    );
};

export default IndexPage;
