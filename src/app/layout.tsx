import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Solana DApp Learning',
  description: 'Learn Solana development with Devnet wallet, counter, and oracle examples.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  )
}
