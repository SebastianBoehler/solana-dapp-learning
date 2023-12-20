import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback } from "react";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js';

const programId = new PublicKey('7aAKLxbTS8nGaD5QEpbTooNhqjYn8s6sMmQ4gZJYsQrg')
const pubkey = programId

const keys = [
    { pubkey, isSigner: false, isWritable: false },
]

export const HelloWorld: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();

    console.log('inside own program')

    const callProgram = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        console.log('string data', Buffer.from([149, 118, 59, 220, 196, 127, 161, 179]).toString())

        const transaction = new Transaction().add(
            new TransactionInstruction({
                keys,
                programId,
                data: Buffer.from([149, 118, 59, 220, 196, 127, 161, 179]),
            }),
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        //signature equals transaction hash
        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        const result = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        console.log({ result, signature })

    }, [publicKey, sendTransaction, connection])

    return (
        <button onClick={callProgram} disabled={!publicKey}>
            Hello World call custom program id
        </button>
    );
};
