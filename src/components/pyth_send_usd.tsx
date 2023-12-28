/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/TeN8y90YK5Z
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import config from "@/config";
import { getProgram } from "@/hooks/anchor";
import { PublicKey } from "@solana/web3.js";
import { WalletNotConnectedError, } from '@solana/wallet-adapter-base';
import * as anchor from '@project-serum/anchor'
import { BN } from "@project-serum/anchor";
import { toast } from "react-toastify";

export function PythSendUsd() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet()
  const [usdAmount, setUsdAmount] = useState<number>(0)
  const [recipientAddress, setRecipientAddress] = useState<string>('')

  const send = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    if (usdAmount <= 0) throw new Error(`trying to send ${usdAmount} USD. Amount must be greater than 0`)
    const program = await getProgram(connection, wallet, config.payUsdProgramId, config.payUsdIdl)

    console.log('sending', usdAmount, 'USD to', recipientAddress)

    const hash = await program.methods
      .payUsd(new BN(usdAmount))
      .accounts({
        from: publicKey,
        to: new PublicKey(recipientAddress),
        solUsdPriceAccount: new PublicKey('J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix'),
        systemProgram: anchor.web3.SystemProgram.programId,

      })
      .rpc()
      .catch((err) => {
        console.error(err)
        alert('Transaction failed. Please try again.')
        return null
      })

    if (hash) alert(`Tx hash: ${hash}`)
    console.log('tx hash', hash)
    return hash
  }, [wallet, connection, publicKey, usdAmount, recipientAddress])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-8 md:px-12 lg:px-24 xl:px-32">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Send Money Instantly</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Input the recipient's address, enter the amount in USD and press 'Send'. The system will convert the USD
                to SOL and initiate the transfer instantly.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex flex-col space-y-4">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Recipient's address"
                  type="text"
                  onChange={(e) => {
                    setRecipientAddress(e.target.value)
                  }}
                />
                <div className="relative max-w-lg">
                  <Input
                    className="pr-12"
                    placeholder="Amount"
                    type="number"
                    onChange={(e) => {
                      setUsdAmount(Number(e.target.value))
                    }}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">USD</span>
                </div>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={send}
                  disabled={usdAmount <= 0 || !recipientAddress}
                >Send</Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By clicking 'Send', you agree to being fully responsible for the transfer of funds.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <img
              alt="Send Money"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="500"
              src="/placeholder.svg"
              width="500"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
