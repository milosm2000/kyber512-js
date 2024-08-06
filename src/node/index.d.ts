import {
  KyberParams,
  KeyPair,
  EncapsulationResult,
  DecapsulationResult,
} from "../common";

export interface KyberNode {
  generateKeys: () => KeyPair;
  encapsulate: (publicKey: Uint8Array) => EncapsulationResult;
  decapsulate: (
    ciphertext: Uint8Array,
    privateKey: Uint8Array
  ) => DecapsulationResult;
  KYBER_PARAMS: KyberParams;
  HEAP8: Int8Array;
}

declare const kyberModule: Promise<KyberNode>;
export = kyberModule;
