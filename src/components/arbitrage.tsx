import { set } from "@project-serum/anchor/dist/cjs/utils/features";
import { PriceStatus, Product, PythConnection, getPythProgramKeyForCluster } from "@pythnetwork/client";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, VersionedTransaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import React, { useCallback, useEffect, useState } from "react"
import { FC } from "react"
import { createJupiterApiClient } from "@jup-ag/api"

interface Ticker {
    "ticker_id": string,
    "ticker": string,
    "base_currency": string,
    "target_currency": string,
    "last_price": number,
    "base_volume": number,
    "target_volume": number,
    "high": number,
    "low": number,
    "base_address": string,
    "target_address": string,
    "bid": number,
    "ask": number,
}

const jupiterQuoteApi = createJupiterApiClient();

export const Arbitrage: FC = () => {
    const { connection } = useConnection();
    const [tickers, setTickers] = useState<Ticker[]>([])
    const [opportunities, setOpportunities] = useState<[Ticker, Ticker, number][]>([])


    const load = useCallback(async () => {
        const resp = await fetch('https://stats.jup.ag/coingecko/tickers')
            .catch((err) => {
                console.error(err);
                return null;
            });
        if (!resp) return;
        const data = await resp.json() as Ticker[]

        console.log('loaded data')

        setTickers(data.map(
            (ticker: Ticker) => ({
                ...ticker,
                last_price: +ticker.last_price,
                base_volume: +ticker.base_volume,
                target_volume: +ticker.target_volume,
                high: +ticker.high,
                low: +ticker.low,
                bid: +ticker.bid,
                ask: +ticker.ask,
            })
        ))
    }, [])

    const checkArbitrage = useCallback(async () => {
        setOpportunities([])
        await load()
        for (const ticker of tickers) {
            const base = ticker.base_address
            const quote = ticker.target_address

            if (!base || !quote) continue

            const matches = tickers.filter(t => t.base_address === quote && t.target_address === base)

            for (const match of matches) {
                const opportunity = await checkArbitrageOpportunity(ticker, match)
                console.log(opportunity)
                if (opportunity) {
                    setOpportunities([...opportunities, opportunity])
                }
            }
        }
    }, [tickers, opportunities])

    const checkArbitrageOpportunity = async (pair1: Ticker, pair2: Ticker, fees = 0, gas = 0) => {
        // Get the current prices of the pairs
        let amount = 1

        //we sell the base and buy quote of first pair
        amount = amount * pair1.last_price
        //we sell the quote and buy base of second pair
        amount = amount * pair2.last_price

        if (true) {
            return [pair1, pair2, amount] as [Ticker, Ticker, number];
        }

        // If the profit is not greater than 0, return null
        return null;
    }

    const execute = async (pair1: Ticker, pair2: Ticker) => {
        console.log('pubkey', user.publicKey.toBase58(), pair1, pair2)
        const quote = await jupiterQuoteApi.quoteGet({
            inputMint: pair1.base_address,
            outputMint: pair1.target_address,
            amount: 100000000000,
            // platformFeeBps: 10,
            // asLegacyTransaction: true, // legacy transaction, default is versoined transaction
        })

        const swapResp = await jupiterQuoteApi.swapPost({
            swapRequest: {
                quoteResponse: quote,
                userPublicKey: user.publicKey.toBase58(),
                wrapAndUnwrapSol: true,
            }
        })
        const swap = swapResp.swapTransaction
        console.log(swap)

        const swapTransactionBuf = Buffer.from(swap, 'base64');
        let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        transaction.sign([user]);
        const rawTransaction = transaction.serialize();

        const hash = await connection.sendRawTransaction(rawTransaction);

        console.log('executed', hash)

    }

    return (
        <div>
            <button onClick={checkArbitrage}>Check Arbitrage</button>
            <div>
                {opportunities.map(([pair1, pair2, profit], index) => (
                    <div key={index}>
                        <div>{pair1.base_currency} {pair1.target_currency}</div>
                        <div>{pair2.base_currency} {pair2.target_currency}</div>
                        <div>{profit}</div>
                        <button onClick={() => { execute(pair1, pair2) }}>Execute</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
