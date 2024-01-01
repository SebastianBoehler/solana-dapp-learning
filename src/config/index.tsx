import { Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

const counterIdl = { "version": "0.1.0", "name": "my_counter", "instructions": [{ "name": "initialize", "accounts": [{ "name": "user", "isMut": true, "isSigner": true }, { "name": "set", "isMut": true, "isSigner": false }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [] }, { "name": "decreaseCounter", "accounts": [{ "name": "user", "isMut": false, "isSigner": true }, { "name": "set", "isMut": true, "isSigner": false }], "args": [{ "name": "number", "type": "u8" }] }, { "name": "increaseCounter", "accounts": [{ "name": "user", "isMut": false, "isSigner": true }, { "name": "set", "isMut": true, "isSigner": false }], "args": [{ "name": "number", "type": "u8" }] }, { "name": "closeCounterPda", "accounts": [{ "name": "user", "isMut": false, "isSigner": true }, { "name": "set", "isMut": true, "isSigner": false }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [] }], "accounts": [{ "name": "Counter", "type": { "kind": "struct", "fields": [{ "name": "count", "type": "u8" }] } }], "errors": [{ "code": 6000, "name": "DataInputInvalid", "msg": "Only positive numbers supported" }, { "code": 6001, "name": "MaxStepSize", "msg": "Max step size is too big" }] }
const payUsdIdl = { "version": "0.1.0", "name": "pyth_program", "instructions": [{ "name": "payUsd", "accounts": [{ "name": "from", "isMut": false, "isSigner": true }, { "name": "to", "isMut": true, "isSigner": false }, { "name": "solUsdPriceAccount", "isMut": false, "isSigner": false }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [{ "name": "amount", "type": "u64" }] }], "errors": [{ "code": 6000, "name": "PriceIsDown" }, { "code": 6001, "name": "WrongPriceFeedId" }] }
const myOracle = { "version": "0.1.0", "name": "my_oracle", "instructions": [{ "name": "initialize", "accounts": [{ "name": "dataStore", "isMut": true, "isSigner": true }, { "name": "signer", "isMut": true, "isSigner": true }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [] }, { "name": "update", "accounts": [{ "name": "dataStore", "isMut": true, "isSigner": false }], "args": [{ "name": "data", "type": "u64" }] }], "accounts": [{ "name": "NewAccount", "type": { "kind": "struct", "fields": [{ "name": "data", "type": "u64" }] } }] }

export default {
    counterProgramId: new PublicKey('53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w'),
    payUsdProgramId: new PublicKey('SwaoHArzRjzX16rctWM6EdeFBWHbitv91H3QuwELeyd'),
    myOracleProgramId: new PublicKey('CR651qrjHq9v18JC9qqzHZcFThFTa9dycHXofxxFcotn'),
    counterIdl: counterIdl as Idl,
    payUsdIdl: payUsdIdl as Idl,
    myOracleIdl: myOracle as Idl,
}
