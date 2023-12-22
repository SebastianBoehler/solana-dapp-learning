import { PublicKey } from '@solana/web3.js';

const idl = { "version": "0.1.0", "name": "hello_world", "instructions": [{ "name": "hello", "accounts": [], "args": [] }, { "name": "anotherFunc", "accounts": [], "args": [] }, { "name": "decreaseCounter", "accounts": [{ "name": "set", "isMut": true, "isSigner": true }, { "name": "signer", "isMut": true, "isSigner": true }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [{ "name": "number", "type": "u64" }] }, { "name": "increaseCounter", "accounts": [{ "name": "set", "isMut": true, "isSigner": true }, { "name": "signer", "isMut": true, "isSigner": true }, { "name": "systemProgram", "isMut": false, "isSigner": false }], "args": [{ "name": "number", "type": "u64" }] }], "accounts": [{ "name": "Interactions", "type": { "kind": "struct", "fields": [{ "name": "counter", "type": "u64" }] } }] }

export default {
    programId: new PublicKey('7aAKLxbTS8nGaD5QEpbTooNhqjYn8s6sMmQ4gZJYsQrg'),
    idl,
}
