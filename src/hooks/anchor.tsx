import config from '@/config'
import { Address, AnchorProvider, Idl, Program } from '@project-serum/anchor'
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection } from '@solana/web3.js'
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';

//create function that gets the programm
export const getProgram = async (connection: Connection, wallet: AnchorWallet | undefined, programId: Address, idl: Idl) => {
    if (!wallet) throw new WalletNotConnectedError();
    const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions(),
    )
    const program = new Program(idl, programId, provider)
    return program
}

export const getDataAccounts = async <T extends unknown>(connection: Connection, wallet: AnchorWallet | undefined, programId: Address, idl: Idl) => {
    if (!wallet) return []
    const program = await getProgram(connection, wallet, programId, idl)
    const accs = await program.account.counter.all() as T[]
    return accs
}

export const fetchDataAccount = async <T extends unknown>(connection: Connection, wallet: AnchorWallet | undefined, programId: Address, pubKey: PublicKey, idl: Idl) => {
    if (!wallet) return
    const program = await getProgram(connection, wallet, programId, idl)
    const acc = await program.account.counter.fetch(pubKey)
        .catch((err) => {
            console.log(err)
            return null
        })
    return acc as T | null
}
