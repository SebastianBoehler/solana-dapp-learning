import React, { useCallback, useEffect } from 'react';
import './style.css'
import config from '@/config';
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, sendAndConfirmTransaction } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { setInterval } from 'timers';
import { sha256 } from "js-sha256";
import { createOraclePdaUsingAnchor } from '@/hooks/oracle';
import * as anchor from '@project-serum/anchor'

const IndexPage: React.FC = () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
    const [pda, setPDA] = React.useState<PublicKey>()

    const seed = [
        145, 67, 244, 0, 128, 81, 28, 140, 30, 34, 98, 163, 92, 237, 42, 203, 188,
        27, 149, 49, 177, 247, 38, 203, 54, 213, 5, 101, 164, 246, 156, 7,
    ];
    const keypair = Keypair.fromSeed(new Uint8Array(seed));

    const init = useCallback(async () => {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                anchor.utils.bytes.utf8.encode("oracle"),
                keypair.publicKey.toBuffer(),
            ],
            config.myOracleProgramId
        );
        //await createOraclePdaManually(keypair, connection)
        const hash = await createOraclePdaUsingAnchor(keypair, connection, pda, 'BTC/USD')
        console.log(hash, pda.toBase58())

        setPDA(pda)
    }, [connection, keypair])

    const writeData = useCallback(async () => {
        setInterval(async () => {
            if (!pda) {
                return
            }
            const keys = [
                { pubkey: pda, isSigner: false, isWritable: true },
                { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
            ];

            // Define the fixed instruction identifier
            const name = 'global' + ':' + 'update';
            const instructionIdentifier = Buffer.from(sha256.digest(name)).subarray(0, 8)
            // Use a u64 value
            const data = BigInt(Math.floor(Math.random() * 1000));

            // Create a buffer for the u64 value
            const u64Buffer = Buffer.alloc(8);
            u64Buffer.writeBigInt64LE(data, 0);

            // Concatenate the buffers
            const instructionBuffer = Buffer.concat([instructionIdentifier, u64Buffer]);

            let transaction = new Transaction();
            transaction.add(
                new TransactionInstruction({
                    keys,
                    programId: config.myOracleProgramId,
                    data: instructionBuffer
                }),
            );

            const hash = await sendAndConfirmTransaction(connection, transaction, [keypair])
            console.log(hash, data.toString())
        }, 1000 * 5)
    }, [])

    return (
        <div>
            <p>Pub key:  {keypair.publicKey.toBase58()}</p>
            <p>pda: {pda?.toBase58()}</p>
            <Button onClick={init}>Init</Button>
            <Button onClick={writeData}>Write data</Button>
        </div>
    );
};

export default IndexPage;
