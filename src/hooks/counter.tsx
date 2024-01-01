import { getProgram } from "./anchor"
import * as anchor from '@project-serum/anchor'
import { Connection, PublicKey, Keypair } from "@solana/web3.js"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Address } from "@project-serum/anchor"
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';
import config from "@/config"

export interface Wrapper {
    connection: Connection,
    wallet: AnchorWallet | undefined,
    programId: Address,
}

export const createCounter = async ({ connection, wallet, programId }: Wrapper, user: anchor.web3.PublicKey | null) => {
    if (!wallet || !user) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId, config.counterIdl)

    const [userCounterPDA, _] = PublicKey.findProgramAddressSync(
        [
            anchor.utils.bytes.utf8.encode("counter"),
            wallet.publicKey.toBuffer(),
        ],
        program.programId
    );

    console.log('userCounterPDA', userCounterPDA.toBase58())

    const hash = await program.methods
        .initialize()
        .accounts({
            set: userCounterPDA,
            user,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc()

    return { hash, pubKey: userCounterPDA }
}

export const increaseCounter = async ({
    connection,
    wallet,
    programId,
}: Wrapper, counterKey: Address, number: number) => {
    if (!wallet) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId, config.counterIdl)

    const hash = await program.methods
        .increaseCounter(new anchor.BN(number))
        .accounts({
            set: counterKey,
        })
        .rpc()
    return hash
}

export const decreaseCounter = async ({
    connection, wallet, programId
}: Wrapper, counterKey: Address, number: number) => {
    if (!wallet) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId, config.counterIdl)

    const hash = await program.methods
        .decreaseCounter(new anchor.BN(number))
        .accounts({
            set: counterKey,
        })
        .rpc()
    return hash
}

export const closeCounter = async ({
    connection, wallet, programId
}: Wrapper, counterKey: Address) => {
    if (!wallet) throw new WalletNotConnectedError();
    const program = await getProgram(connection, wallet, programId, config.counterIdl)

    const hash = await program.methods
        .closeCounterPda()
        .accounts({
            set: counterKey,
            user: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc()
    return hash
}


