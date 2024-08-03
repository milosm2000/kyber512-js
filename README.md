# Kyber512-js

A JavaScript implementation of the Kyber512 post-quantum cryptographic algorithm, compatible with both Node.js and browser environments.

## Features

- Compatible with Node.js and browser environments
- Implements Kyber512 key generation, encapsulation, and decapsulation
- Provides access to Kyber512 parameters

## Installation

```bash
npm install kyber512-js
```

# Usage

## Node.js

```javascript
const kyber512 = require("kyber512-js");

kyber512.then((kyber) => {
  // Generate key pair
  const { publicKey, privateKey } = kyber.generateKeys();

  // Encapsulate
  const { ciphertext, sharedSecret: aliceSharedSecret } =
    kyber.encapsulate(publicKey);

  // Decapsulate
  const { sharedSecret: bobSharedSecret } = kyber.decapsulate(
    ciphertext,
    privateKey
  );

  // Verify shared secrets match
  console.log(
    aliceSharedSecret.toString("hex") === bobSharedSecret.toString("hex")
  );
});
```

## Browser

To use Kyber512-js in a browser:

1. Ensure `kyber.wasm` is in your public directory.
2. Adjust the WASM fetch path in `./browser/index.js`, by default it's set to `node_modules/kyber512-js/kyber.wasm`:

```javascript
async function fetchWasm() {
  return await (await fetch("/path/to/your/kyber.wasm")).arrayBuffer();
}
```

Replace /path/to/your/kyber.wasm with the actual path where you serve the WASM file.
Note: Configure your server to serve WASM files with application/wasm MIME type.

```javascript
import { createKyber } from "./node_modules/kyber512-js/dist/kyber.min.js";

createKyber().then((kyber) => {
  // Generate key pair
  const { publicKey, privateKey } = kyber.generateKeys();

  // Encapsulate
  const { ciphertext, sharedSecret: aliceSharedSecret } =
    kyber.encapsulate(publicKey);

  // Decapsulate
  const { sharedSecret: bobSharedSecret } = kyber.decapsulate(
    ciphertext,
    privateKey
  );

  // Verify shared secrets match
  console.log(
    aliceSharedSecret.toString("hex") === bobSharedSecret.toString("hex")
  );
});
```

## API

# generateKeys()

Generates a new Kyber512 key pair.
Returns: { publicKey: Uint8Array, privateKey: Uint8Array }

# encapsulate(publicKey: Uint8Array)

Encapsulates a shared secret using the provided public key.
Returns: { ciphertext: Uint8Array, sharedSecret: Uint8Array }

# decapsulate(ciphertext: Uint8Array, privateKey: Uint8Array)

Decapsulates a shared secret using the provided ciphertext and private key.
Returns: { sharedSecret: Uint8Array }

# KYBER_PARAMS

An object containing Kyber512 parameters:

```javascript

console.log(kyber.KYBER_PARAMS);

// output:
  {
    CRYPTO_PUBLICKEYBYTES: 800,
    CRYPTO_SECRETKEYBYTES: 1632,
    CRYPTO_CIPHERTEXTBYTES: 768,
    CRYPTO_BYTES: 32,
  };
```

# Building from Source

To build browser minified bundle:

- Clone the repository
- Run npm install
- Run npm run build
