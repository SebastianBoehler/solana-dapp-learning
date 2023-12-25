import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import React, { FC, useCallback, useEffect } from "react";
import * as anchor from '@project-serum/anchor'
import { Keypair, PublicKey } from "@solana/web3.js";
import { createCounter, decreaseCounter, increaseCounter } from "@/hooks/counter";
import config from "@/config";
import { getDataAccounts } from "@/hooks/anchor";
const { BN } = anchor

interface CounterAcc { publicKey: PublicKey, account: { count: number } }

export const HelloWorld: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useAnchorWallet()
    const [dataAccs, setDataAccs] = React.useState<CounterAcc[]>([])
    const WalletData = { connection, wallet, programId: config.programId }

    const getData = async () => {
        const accs = (await getDataAccounts<CounterAcc>(connection, wallet, config.programId))
        setDataAccs(accs)
    }

    useEffect(() => {
        getData()
    }, [connection, publicKey])

    const create = useCallback(async () => {
        await createCounter(WalletData, publicKey)
        setTimeout(() => {
            getData()
        }, 1000 * 2);
    }, [wallet, connection])

    const increase = useCallback(async (programKey: PublicKey) => {
        await increaseCounter(WalletData, programKey, new BN(4))
        setTimeout(() => {
            getData()
        }, 1000 * 2);
    }, [wallet, connection])

    const decrease = useCallback(async (programKey: PublicKey) => {
        await decreaseCounter(WalletData, programKey, new BN(20))
        setTimeout(() => {
            getData()
        }, 1000 * 2);
    }, [wallet, connection])

    return (
        <>
            <h2>Counter Program on Solana</h2>
            <div style={{ margin: '25px 0' }}>
                <button onClick={() => { create() }}>
                    Create new counter
                </button>
            </div>
            <div>
                {dataAccs.map((acc, i) => {
                    console.log(acc)
                    const count = acc.account.count || 0

                    return (
                        <div key={i} style={{ display: 'inline-block', padding: '5px' }}>
                            <div>Counter {acc.publicKey.toBase58().slice(0, 5)}: {count}</div>
                            <button onClick={() => { increase(acc.publicKey) }}>Increase</button>
                            <button onClick={() => { decrease(acc.publicKey) }}>Decrease</button>
                        </div>
                    )
                })}
            </div>
        </>
    );
};
