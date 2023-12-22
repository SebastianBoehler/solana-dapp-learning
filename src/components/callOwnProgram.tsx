import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback } from "react";
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';
import { getProgram } from "@/hooks/anchor";
import * as anchor from '@project-serum/anchor'
import { Keypair } from "@solana/web3.js";
const { BN } = anchor

export const HelloWorld: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet()

    const callProgram = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!wallet) throw new WalletNotConnectedError();

        const program = await getProgram(connection, wallet)
        //@ts-ignore
        window.program = program

        const txHash2 = await program.methods.anotherFunc().rpc()
        console.log('another_func called', { txHash2 })

        const increase = await program.methods
            .increaseCounter(new BN(32, undefined, "le"))
            .accounts({
                set: Keypair.generate().publicKey,
                signer: publicKey,
                systemProgram: '11111111111111111111111111111111' //anchor.web3.SystemProgram.programId,
            })
            .signers([])
            .rpc()


        console.log('increaseCounter called', { increase })

    }, [publicKey, sendTransaction, connection])

    return (
        <button onClick={callProgram} disabled={!publicKey}>
            Hello World call custom program id
        </button>
    );
};
