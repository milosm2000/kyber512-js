export interface KyberParams {
  CRYPTO_PUBLICKEYBYTES: number;
  CRYPTO_SECRETKEYBYTES: number;
  CRYPTO_CIPHERTEXTBYTES: number;
  CRYPTO_BYTES: number;
}

export const KYBER_PARAMS: KyberParams;

export interface KeyPair {
  result: number;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface EncapsulationResult {
  result: number;
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}

export interface DecapsulationResult {
  result: number;
  sharedSecret: Uint8Array;
}

export function generateKeys(kyber: any): KeyPair;
export function encapsulate(
  kyber: any,
  publicKey: Uint8Array
): EncapsulationResult;
export function decapsulate(
  kyber: any,
  ciphertext: Uint8Array,
  privateKey: Uint8Array
): DecapsulationResult;
