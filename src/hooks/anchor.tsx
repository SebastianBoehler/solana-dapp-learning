import config from '@/config'
import { Address, AnchorProvider, Program } from '@project-serum/anchor'
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection } from '@solana/web3.js'
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';

//create function that gets the programm
export const getProgram = async (connection: Connection, wallet: AnchorWallet | undefined, programId: Address) => {
    if (!wallet) throw new WalletNotConnectedError();
    const idl = config.idl
    const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions(),
    )
    const program = new Program(idl, programId, provider)
    return program
}

export const getDataAccounts = async (connection: Connection, wallet: AnchorWallet | undefined, programId: Address) => {
    if (!wallet) return []
    const program = await getProgram(connection, wallet, programId)
    const accs = await program.account.counter.all()
    return accs
}
