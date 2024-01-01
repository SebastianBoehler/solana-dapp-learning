import config from "@/config";
import { Program } from "@project-serum/anchor";
import { Connection, Keypair, TransactionInstruction } from "@solana/web3.js";
import { sendAndConfirmTransaction, Transaction, SystemProgram } from "@solana/web3.js";
import { sha256 } from "js-sha256";

export const createOraclePdaUsingAnchor = async (keypair: Keypair, connection: Connection) => {
    const pda = Keypair.generate();
    const pg = new Program(config.myOracleIdl, config.myOracleProgramId, { connection })

    const instruction = await pg.methods
        .initialize()
        .accounts({
            signer: keypair.publicKey,
            dataStore: pda.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .instruction()

    let transaction = new Transaction();
    transaction.add(
        instruction,
    );

    const hash = await sendAndConfirmTransaction(connection, transaction, [keypair, pda])
    return { hash, pda: pda.publicKey }
}

export const createOraclePdaManually = async (keypair: Keypair, connection: Connection) => {
    const pda = Keypair.generate();
    const keys = [
        { pubkey: pda.publicKey, isSigner: false, isWritable: true },
        { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ];

    // Define the fixed instruction identifier
    const name = 'global:initialize';
    const instructionIdentifier = Buffer.from(sha256.digest(name)).subarray(0, 8)

    let transaction = new Transaction();
    transaction.add(
        new TransactionInstruction({
            keys,
            programId: config.myOracleProgramId,
            data: instructionIdentifier
        }),
    );

    const hash = await sendAndConfirmTransaction(connection, transaction, [keypair, pda])
    return { hash, pda: pda.publicKey }
}
