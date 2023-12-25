import { Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

const idl = { "version": "0.1.0", "name": "my_counter", "instructions": [{ "name": "initalize", "accounts": [{ "name": "set", "isMut": true, "isSigner": true }, { "name": "user", "isMut": true, "isSigner": true }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [] }, { "name": "decreaseCounter", "accounts": [{ "name": "set", "isMut": true, "isSigner": false }], "args": [{ "name": "number", "type": "u8" }] }, { "name": "increaseCounter", "accounts": [{ "name": "set", "isMut": true, "isSigner": false }], "args": [{ "name": "number", "type": "u8" }] }], "accounts": [{ "name": "Counter", "type": { "kind": "struct", "fields": [{ "name": "count", "type": "u8" }] } }], "errors": [{ "code": 6000, "name": "DataInputInvalid", "msg": "Only positive numbers supported" }, { "code": 6001, "name": "MaxStepSize", "msg": "Max step size is too big" }] }

export default {
    programId: new PublicKey('53fUjUVA7GCU2r279UD43NjCXRaR2dnocwwDZQKvAf1w'),
    idl: idl as Idl,
}
