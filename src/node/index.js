const fs = require("fs");
const path = require("path");
const kyberFactory = require("../../kyber.js");
const {
  KYBER_PARAMS,
  generateKeys,
  encapsulate,
  decapsulate,
} = require("../common");

// Read the WebAssembly file
const wasmPath = path.join(__dirname, "../../kyber.wasm");
const wasmBinary = fs.readFileSync(wasmPath);

// Define a custom locateFile function for Node.js
const nodeLocateFile = (filename) => {
  if (filename.endsWith(".wasm")) {
    return wasmPath;
  }
  return filename;
};

// Initialize the Kyber module with the WebAssembly binary
const kyberModule = kyberFactory({
  wasmBinary,
  locateFile: nodeLocateFile,
});

module.exports = kyberModule.then((kyber) => ({
  generateKeys: () => generateKeys(kyber),
  encapsulate: (publicKey) => encapsulate(kyber, publicKey),
  decapsulate: (ciphertext, privateKey) =>
    decapsulate(kyber, ciphertext, privateKey),
  KYBER_PARAMS,
  HEAP8: kyber.HEAP8, // Add this line
}));
