import config from '@/config'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection } from '@solana/web3.js'

//create function that gets the programm
export const getProgram = async (connection: Connection, wallet: AnchorWallet) => {
    const idl = config.idl
    const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions(),
    )
    const program = new Program(idl, config.programId, provider)
    return program
}

export const getProgramAccPk = async (seeds: (Uint8Array | Buffer)[]) => {
    const programId = config.programId
    const programAcc = PublicKey.findProgramAddressSync(seeds, programId)
    return programAcc[0]
}

//probably not needed for current usecase
const getMasterAccPk = async () => {
    const seeds: (Uint8Array | Buffer)[] = []
    const masterAccPk = await getProgramAccPk(seeds)
    return masterAccPk
}
