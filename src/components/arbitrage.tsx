import { PriceStatus, PythConnection, getPythProgramKeyForCluster } from "@pythnetwork/client";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import React, { useState } from "react"
import { FC } from "react"

export const Counter: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const wallet = useAnchorWallet()

    const pythConnection = new PythConnection(connection, getPythProgramKeyForCluster('devnet'))
    pythConnection.onPriceChange((product, price) => {
        // sample output:
        // Crypto.SRM/USD: $8.68725 ±$0.0131 Status: Trading
        console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence} Status: ${PriceStatus[price.status]}`)
    })

    pythConnection.start()

    return (
        <div></div>
    )
}
