import { getProgram } from "./anchor"
import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey, Keypair } from "@solana/web3.js"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Address } from "@project-serum/anchor"
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';

export interface Wrapper {
    connection: Connection,
    wallet: AnchorWallet | undefined,
    programId: Address,
}

export const createCounter = async ({ connection, wallet, programId }: Wrapper, user: anchor.web3.PublicKey | null) => {
    if (!wallet || !user) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId)
    const counterAcc = Keypair.generate()

    await program.methods
        .initalize()
        .accounts({
            set: counterAcc.publicKey,
            user,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([counterAcc])
        .rpc()

    return counterAcc.publicKey
}

export const increaseCounter = async ({
    connection,
    wallet,
    programId,
}: Wrapper, counterKey: Address, number: number) => {
    if (!wallet) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId)

    await program.methods
        .increaseCounter(new anchor.BN(number))
        .accounts({
            set: counterKey,
        })
        .rpc()
}

export const decreaseCounter = async ({
    connection, wallet, programId
}: Wrapper, counterKey: Address, number: number) => {
    if (!wallet) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId)

    await program.methods
        .decreaseCounter(new anchor.BN(number))
        .accounts({
            set: counterKey,
        })
        .rpc()
}


