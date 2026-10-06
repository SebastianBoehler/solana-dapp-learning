# Contributing

Small corrections and focused learning examples are welcome. Open an issue
before proposing a large change so we can agree on the lesson and scope.

## Local checks

Use Node.js 24 and npm. The repository uses one npm lockfile and a Cargo lockfile.

```sh
npm ci
npm run typecheck
npm test
npm run build
cargo test --workspace --locked
```

Keep files around 300 lines or fewer. Match the existing lesson structure and
show errors directly. Keep amount conversions in integer base units. Changes
to Rust instruction arguments must also update their client builders and tests.

## Manual checks

Use your own Devnet wallet and matching deployed programs. Never include API
keys, signing seeds, or deployment keypairs in a contribution.

- Connect, disconnect, and switch wallet accounts. Reject a signing request and check the displayed error.
- Send a small Devnet SOL transfer and inspect its confirmed transaction.
- Load, initialize, increase, decrease, and close the counter. Try a second wallet to check PDA isolation.
- Initialize the exchange data store, write one value, and verify its name and scaled data. Navigate away and check that the stream closes.
- Configure a current Pyth SOL/USD Devnet account. Verify payment conversion, and verify rejection of stale accounts and incorrect feeds.
- With server-only API keys configured, read a Hermes price and compare Jupiter round-trip quotes. Without keys, verify the setup errors.
- Call the token helper from a connected-wallet component and inspect the mint, token account, and 200-token balance.

Describe the exact checks you ran in your pull request. Distinguish host Rust
tests from SBF builds and local UI checks from confirmed network transactions.

## Commit messages

Use concise prefixes such as `fix:`, `docs:`, and `feat(counter):`.
Keep unrelated changes in separate commits.
