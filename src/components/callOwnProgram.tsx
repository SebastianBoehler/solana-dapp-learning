import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback } from "react";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';
import config from "@/config";
import { getProgram } from "@/hooks/anchor";
const pubkey = config.programId

const keys = [
    { pubkey, isSigner: false, isWritable: false },
]

export const HelloWorld: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet()

    console.log('inside own program')

    const callProgram = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!wallet) throw new WalletNotConnectedError();

        const program = await getProgram(connection, wallet)

        const txHash = await program.methods.hello().rpc()
        console.log({ txHash })

        const txHash2 = await program.methods.anotherFunc().rpc()
        console.log({ txHash2 })

    }, [publicKey, sendTransaction, connection])

    return (
        <button onClick={callProgram} disabled={!publicKey}>
            Hello World call custom program id
        </button>
    );
};
