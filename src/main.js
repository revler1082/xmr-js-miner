// nodejs main
var inputStr = process.argv[2];

if (typeof inputStr === "undefined") {
  console.error("Usage: node src/main.js inputStr");
  process.exit(1);
}

var inputBytes = new ArrayBuffer(inputStr.length);
for (var i = 0; i < inputStr.length; i++) {
  inputBytes[i] = inputStr.charCodeAt(i);
}

var keccak = require("./keccak");
var a64 = keccak._load64(inputBytes);
console.log("a64", a64);
var ba8 = keccak._store64(a64);
console.log("ba8", ba8);
console.log("_rotl64  0", keccak._rotl64(a64, 0));
console.log("_rotl64 32", keccak._rotl64(a64, 32));
console.log("_rotl64  8", keccak._rotl64(a64, 8));
console.log("_rotl64 26", keccak._rotl64(a64, 36));
console.log("_not64", keccak._not64(a64));
console.log("_xor64", keccak._xor64(a64, a64));
console.log("_xor64", keccak._xor64(a64, keccak._not64(a64)));
console.log("_and64", keccak._and64(a64, a64));
console.log("_and64", keccak._and64(a64, keccak._not64(a64)));
