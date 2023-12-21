import { PublicKey } from '@solana/web3.js';

export default {
    programId: new PublicKey('7aAKLxbTS8nGaD5QEpbTooNhqjYn8s6sMmQ4gZJYsQrg'),
    idl: {
        "version": "0.1.0",
        "name": "hello_world",
        "instructions": [
            { "name": "hello", "accounts": [], "args": [] },
            { "name": "another_func", "accounts": [], "args": [] }
        ]
    }
}
