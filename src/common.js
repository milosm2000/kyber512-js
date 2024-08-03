const KYBER_PARAMS = {
  CRYPTO_PUBLICKEYBYTES: 800,
  CRYPTO_SECRETKEYBYTES: 1632,
  CRYPTO_CIPHERTEXTBYTES: 768,
  CRYPTO_BYTES: 32,
};

function generateKeys(kyber) {
  const publicKeyPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_PUBLICKEYBYTES);
  const privateKeyPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_SECRETKEYBYTES);

  const result = kyber.ccall(
    "kyber512_keypair",
    "number",
    ["number", "number"],
    [publicKeyPtr, privateKeyPtr]
  );

  let publicKey, privateKey;
  if (result === 0) {
    publicKey = new Uint8Array(
      kyber.HEAPU8.subarray(
        publicKeyPtr,
        publicKeyPtr + KYBER_PARAMS.CRYPTO_PUBLICKEYBYTES
      )
    );
    privateKey = new Uint8Array(
      kyber.HEAPU8.subarray(
        privateKeyPtr,
        privateKeyPtr + KYBER_PARAMS.CRYPTO_SECRETKEYBYTES
      )
    );
  }

  kyber._free(publicKeyPtr);
  kyber._free(privateKeyPtr);

  return { result, publicKey, privateKey };
}

function encapsulate(kyber, publicKey) {
  if (publicKey.length !== KYBER_PARAMS.CRYPTO_PUBLICKEYBYTES) {
    throw new Error(
      `Invalid public key size. Expected: ${KYBER_PARAMS.CRYPTO_PUBLICKEYBYTES}, Provided: ${publicKey.length}`
    );
  }

  const publicKeyPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_PUBLICKEYBYTES);
  const ciphertextPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_CIPHERTEXTBYTES);
  const sharedSecretPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_BYTES);

  kyber.HEAPU8.set(new Uint8Array(publicKey), publicKeyPtr);

  const result = kyber.ccall(
    "kyber512_encapsulate",
    "number",
    ["number", "number", "number"],
    [ciphertextPtr, sharedSecretPtr, publicKeyPtr]
  );

  let ciphertext, sharedSecret;
  if (result === 0) {
    ciphertext = new Uint8Array(
      kyber.HEAPU8.subarray(
        ciphertextPtr,
        ciphertextPtr + KYBER_PARAMS.CRYPTO_CIPHERTEXTBYTES
      )
    );
    sharedSecret = new Uint8Array(
      kyber.HEAPU8.subarray(
        sharedSecretPtr,
        sharedSecretPtr + KYBER_PARAMS.CRYPTO_BYTES
      )
    );
  }

  kyber._free(publicKeyPtr);
  kyber._free(ciphertextPtr);
  kyber._free(sharedSecretPtr);

  return { result, ciphertext, sharedSecret };
}

function decapsulate(kyber, ciphertext, privateKey) {
  if (ciphertext.length !== KYBER_PARAMS.CRYPTO_CIPHERTEXTBYTES) {
    throw new Error(
      `Invalid ciphertext size. Expected: ${KYBER_PARAMS.CRYPTO_CIPHERTEXTBYTES}, Provided: ${ciphertext.length}`
    );
  }
  if (privateKey.length !== KYBER_PARAMS.CRYPTO_SECRETKEYBYTES) {
    throw new Error(
      `Invalid private key size. Expected: ${KYBER_PARAMS.CRYPTO_SECRETKEYBYTES}, Provided: ${privateKey.length}`
    );
  }

  const ciphertextPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_CIPHERTEXTBYTES);
  const privateKeyPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_SECRETKEYBYTES);
  const sharedSecretPtr = kyber._malloc(KYBER_PARAMS.CRYPTO_BYTES);

  kyber.HEAPU8.set(new Uint8Array(ciphertext), ciphertextPtr);
  kyber.HEAPU8.set(new Uint8Array(privateKey), privateKeyPtr);

  const result = kyber.ccall(
    "kyber512_decapsulate",
    "number",
    ["number", "number", "number"],
    [sharedSecretPtr, ciphertextPtr, privateKeyPtr]
  );

  let sharedSecret;
  if (result === 0) {
    sharedSecret = new Uint8Array(
      kyber.HEAPU8.subarray(
        sharedSecretPtr,
        sharedSecretPtr + KYBER_PARAMS.CRYPTO_BYTES
      )
    );
  }

  kyber._free(ciphertextPtr);
  kyber._free(privateKeyPtr);
  kyber._free(sharedSecretPtr);

  return { result, sharedSecret };
}

module.exports = {
  KYBER_PARAMS,
  generateKeys,
  encapsulate,
  decapsulate,
};
