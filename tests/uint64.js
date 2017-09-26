var Uint64 = require('../src/uint64.js');

var max = new Uint64(0xFFFFFFFF, 0xFFFFFFFF);
console.log("max : " + max.getBinaryString());
console.log("~max : " + max.not().getBinaryString());

var one = new Uint64(0x00000000, 0x00000001);
var two = new Uint64(0x00000000, 0x00000002);
var three = new Uint64(0x00000000, 0x00000003);
var oneone = new Uint64(0x00000001, 0x00000001);
console.log("one : " + one.getBinaryString());
console.log("two : " + two.getBinaryString());
console.log("three : " + three.getBinaryString());
console.log("one.and(two) : " + one.and(two).getBinaryString());
console.log("one.or(two) : " + one.or(two).getBinaryString());
console.log("one.and(three) : " + one.and(three).getBinaryString());
console.log("one.shiftLeft(1) : " + one.shiftLeft(1).getBinaryString());
console.log("oneone.shiftLeft(1) : " + oneone.shiftLeft(1).getBinaryString());
console.log("three.shiftLeft(40) : " + three.shiftLeft(40).getBinaryString());
console.log("oneone.shiftLeft(32) : " + oneone.shiftLeft(32).getBinaryString());
console.log("one.xor(two) : " + one.xor(two).getBinaryString());
console.log("one.xor(three) : " + one.xor(three).getBinaryString());
