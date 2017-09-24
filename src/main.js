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
console.log(a64);
var ba8 = keccak._store64(a64);
console.log(ba8);
console.log(keccak._rotl64(a64, 0));
console.log(keccak._rotl64(a64, 32));
console.log(keccak._rotl64(a64, 8));
console.log(keccak._rotl64(a64, 36));
