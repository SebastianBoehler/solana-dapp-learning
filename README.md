<div align="center">

# Solana DApp Learning

**Learn Solana by building small, readable DApps.**<br>
Wallet connections, SOL transfers, Anchor counters, on-chain data stores, and Pyth-priced payments.

[![Checks](https://github.com/SebastianBoehler/solana-dapp-learning/actions/workflows/checks.yml/badge.svg)](https://github.com/SebastianBoehler/solana-dapp-learning/actions/workflows/checks.yml)
[![Solana Kit](https://img.shields.io/badge/Solana-Kit-9945FF)](https://solana.com/docs/frontend)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Stars](https://img.shields.io/github/stars/SebastianBoehler/solana-dapp-learning)](https://github.com/SebastianBoehler/solana-dapp-learning/stargazers)

[Quick start](#quick-start) · [Examples](#examples) · [Programs](#building-and-deploying-programs) · [Contributing](CONTRIBUTING.md)

</div>

## What this project teaches

This repository began as my first Solana DApp and live-coding learning project.
It now uses Solana Kit and Wallet Standard for the browser examples, with
buildable Anchor sources alongside them. Each lesson exposes the underlying
instructions instead of hiding the transaction flow behind a large framework.

This is an educational project. The wallet actions target **Devnet**. Jupiter
quotes use Mainnet market data and do not execute trades.

## Quick start

Requirements: **Node.js 24**, npm, and a Wallet Standard wallet set to Devnet.

```sh
git clone https://github.com/SebastianBoehler/solana-dapp-learning.git
cd solana-dapp-learning
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Connect your wallet and obtain
Devnet SOL through the [Solana faucet](https://faucet.solana.com/).
The SOL transfer lesson works without deploying a custom program.

Counter, oracle, and USD payments require your own matching programs deployed
on Devnet. Enter their public addresses in `.env.local`, then restart Next.js.
See [program setup](#building-and-deploying-programs).

| Variable | Required for |
| --- | --- |
| `NEXT_PUBLIC_COUNTER_PROGRAM_ID` | Counter actions |
| `NEXT_PUBLIC_ORACLE_PROGRAM_ID` | Exchange data store actions |
| `NEXT_PUBLIC_PAY_USD_PROGRAM_ID` | Pyth-priced SOL payments |
| `NEXT_PUBLIC_SOL_USD_PRICE_ACCOUNT` | A fresh Pyth SOL/USD price update account on Devnet |
| `PYTH_API_KEY` | Server-side Hermes price preview |
| `JUPITER_API_KEY` | Server-side Jupiter V2 quotes |

API keys stay on the server. Do not prefix them with `NEXT_PUBLIC_`.
Missing configuration and upstream failures are shown as errors.

## Examples

| Lesson | Where to start | What happens |
| --- | --- | --- |
| Wallet connection | [`wallet-button.tsx`](src/components/wallet-button.tsx) | Discovers Wallet Standard wallets and connects a Devnet signer |
| SOL transfer | [`sendLamports.tsx`](src/components/sendLamports.tsx) | Builds a System Program transfer to a recipient you enter |
| Counter | [`counter.tsx`](src/components/counter.tsx), [`counter/src/lib.rs`](contract/counter/src/lib.rs) | Derives a wallet PDA, initializes, changes by four, reads, and closes it |
| Exchange data store | [`oracle.tsx`](src/components/oracle.tsx), [`oracle/src/lib.rs`](contract/oracle/src/lib.rs) | Reads BTC/USDT from Binance and lets your wallet write one scaled value |
| Pyth-priced payment | [`pyth_send_usd.tsx`](src/components/pyth_send_usd.tsx), [`pyth-pay-usd/src/lib.rs`](contract/pyth-pay-usd/src/lib.rs) | Sends SOL for a USD amount in cents, using a verified Pyth pull-oracle price |
| SPL token minting | [`spl_token.tsx`](src/hooks/spl_token.tsx) | Callable helper creates a fresh mint and associated token account, then mints 200 tokens |
| Round-trip quotes | [`/arbitrage`](http://localhost:3000/arbitrage), [`jupiter.ts`](src/lib/jupiter.ts) | Compares SOL → USDC → SOL quotes from Jupiter V2 |

The main page contains SOL transfers, payments, the counter, and the exchange
data store. Dedicated pages are available at `/oracle`, `/sendUsd`, and
`/arbitrage`. The token helper is a source example without a dedicated UI:
call `mintToken(client, connected.signer)` from a connected-wallet component.

The exchange data store is **user-controlled data**, not a verified oracle.
The Binance stream closes when the component unmounts. Every write needs wallet
approval; the example does not use a shared signing key or an automated writer.

### Pyth prices

The payment program uses `pyth-solana-receiver-sdk`, validates the SOL/USD feed
and full verification through `get_price_no_older_than`, and rejects prices more
than 60 seconds old or dated in the future. It uses checked integer arithmetic
and rounds up to the next lamport. Only system-owned recipient accounts are accepted.

Configure a current Pyth **Devnet** pull-oracle account. Publishing and refreshing
that account is a separate prerequisite; the UI does not publish price updates.
The Hermes button previews an off-chain price through the current Hermes SDK
and a server-only key. That preview is not the payment program's price source.

See [Pyth's Solana integration guide](https://docs.pyth.network/price-feeds/core/use-real-time-data/pull-integration/solana)
and [Hermes authentication](https://docs.pyth.network/price-feeds/core/fetch-price-updates).

### Jupiter quotes

Get an API key from the [Jupiter developer portal](https://developers.jup.ag/portal).
The example calls `/swap/v2/order` without a taker, so it receives quotes without
transactions. Sequential quotes are not atomic. Their difference excludes
execution costs and does not demonstrate profitable arbitrage.
See [Jupiter V2](https://developers.jup.ag/docs/swap).

## Building and deploying programs

The Cargo workspace contains three separate Anchor programs under `contract/`.
It pins Anchor **1.2.1** and Pyth's receiver SDK **2.0.0**.

Host compilation and arithmetic tests require stable Rust:

```sh
cargo test --workspace --locked
```

For deployable Solana binaries, install Anchor CLI **1.2.1** and its supported
Solana/Agave SBF toolchain. Follow the current
[Anchor installation instructions](https://www.anchor-lang.com/docs/installation).
The original public program addresses remain in the sources to preserve project
history; this repository does not contain their deployment keys.

For your own deployments:

1. Generate local program keypairs with your Solana CLI in `target/deploy/`, named `my_counter-keypair.json`, `my_oracle-keypair.json`, and `pyth_program-keypair.json`.
2. Run `anchor keys sync` to update `declare_id!` and `Anchor.toml` to those addresses.
3. Run `anchor build` with the matching current toolchain.
4. Deploy to Devnet with `anchor deploy --provider.cluster devnet` using your funded local wallet.
5. Put the deployed addresses into `.env.local`. Configure the Pyth Devnet account separately.

Keep your local wallet and deployment keypairs out of Git. Keys previously
published with the historical demos have been removed from the current tree;
they remain in Git history and must not be reused.

## Development and verification

```sh
npm run typecheck
npm test
npm run build
cargo test --workspace --locked
```

The JavaScript tests cover exact amount parsing and instruction encoding,
including the counter's `u8` step and the oracle's name/data signatures.
Rust tests cover counter overflow/underflow and USD-to-lamport conversion.
GitHub Actions runs these checks for pushes and pull requests.

These checks validate local compilation and selected behavior. They do not
validate deployed programs, SBF binaries, wallet approvals, live Pyth publishing,
or authenticated Jupiter requests. See [manual checks](CONTRIBUTING.md#manual-checks)
for the remaining integration steps.

## Project layout

```text
src/components/     Lesson UI and shared wallet/status components
src/hooks/          Instruction builders and token example
src/lib/            Solana client, amount parsing, and Jupiter requests
src/pages/          Next.js pages and server-only API routes
contract/           Anchor program sources and Cargo manifests
tests/              JavaScript regression tests
```

## Learning together

The original learning sessions are on my
[YouTube channel](https://www.youtube.com/channel/UC4cUogA7uXT-tYXHp-5VXfQ).
Questions, corrections, and focused example improvements are welcome through
[GitHub issues](https://github.com/SebastianBoehler/solana-dapp-learning/issues)
and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE).
