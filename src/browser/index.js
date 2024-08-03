import kyberFactory from "../../kyber.js";
import {
  KYBER_PARAMS,
  generateKeys,
  encapsulate,
  decapsulate,
} from "../common";

// Function to fetch the WebAssembly file
async function fetchWasm() {
  console.log(`fetching wasm from /node_modules/kyber512-js/kyber.wasm`);
  const response = await fetch("/node_modules/kyber512-js/kyber.wasm");
  return await response.arrayBuffer();
}

// Create the Kyber object
const createKyber = () =>
  fetchWasm()
    .then((wasmBinary) =>
      kyberFactory({
        wasmBinary,
        locateFile: (path) => {
          if (path.endsWith(".wasm")) {
            return "/node_modules/kyber512-js/kyber.wasm";
          }
          return path;
        },
      })
    )
    .then((kyber) => ({
      generateKeys: () => generateKeys(kyber),
      encapsulate: (publicKey) => encapsulate(kyber, publicKey),
      decapsulate: (ciphertext, privateKey) =>
        decapsulate(kyber, ciphertext, privateKey),
      KYBER_PARAMS,
      HEAP8: kyber.HEAP8, // Add this line
    }));

export { createKyber };
