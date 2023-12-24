import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback } from "react";
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';
import { getProgram } from "@/hooks/anchor";
import * as anchor from '@project-serum/anchor'
import { Keypair, PublicKey } from "@solana/web3.js";
const { BN } = anchor

export const HelloWorld: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet()

    const callProgram = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!wallet) throw new WalletNotConnectedError();

        const program = await getProgram(connection, wallet)
        const counterKey = Keypair.generate().publicKey

        const init = await program.methods
            .initalize()
            .accounts({
                set: counterKey,
                user: publicKey,
                systemProgram: '11111111111111111111111111111111' //anchor.web3.SystemProgram.programId,
            })
            .rpc()
            .catch((err) => {
                console.log('err', err)
            })

        console.log('initalizeAcc called', { init })

        //works
        const increase = await program.methods
            .increaseCounter(new BN(2, undefined, "le"))
            .accounts({
                set: new PublicKey('6uzQe1NzrZ7NmeM9qz5pkYD8ViKeobmdM5VAPaV6pBHB'),
            })
            .rpc()
        console.log('increaseCounter called', { increase })

        const decrease = await program.methods
            .decreaseCounter(new BN(6, undefined, "le"))
            .accounts({
                set: new PublicKey('6uzQe1NzrZ7NmeM9qz5pkYD8ViKeobmdM5VAPaV6pBHB'),
            })
            .rpc()
        console.log('decreaseCounter called', { decrease })

    }, [publicKey, sendTransaction, connection])

    return (
        <button onClick={callProgram} disabled={!publicKey}>
            Counter program
        </button>
    );
};
