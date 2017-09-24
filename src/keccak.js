(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(function () {
      return (root.keccak = factory());
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = (root.keccak = factory());
  } else {
    root.keccak = factory();
  }
}(this, function () {
  "use strict";

  // Positions of low and high 32-bit words in an Uint32Array. (These constants
  // are for syntactic sugar. These values cannot be changed without affecting
  // the implementation of functions below.)
  var LO32 = 0, HI32 = 1;

  /**
   * Creates Uint32Array(2) from Uint8Array(8).
   *
   * @param ba8 {Uint8Array} of size 8
   * @returns {Uint32Array} of size 2
   */
  function load64(ba8) {
    var a64 = new Uint32Array(2);
    for (var i = 0; i < 4; i++) {
      var lo = a64[LO32];
      a64[LO32] += (ba8[i] << (8 * i));
      if (lo > a64[LO32]) {
        ++a64[HI32]; //overflow detected
      }
    }
    for (var j = 4; j < 8; j++) {
      a64[HI32] += (ba8[j] << (8 * j));
    }
    return a64;
  }

  /**
   * Creates Uint8Array(8) from Uint32Array(2).
   *
   * @param a64 {Uint32Array} of size 2
   * @returns {Uint8Array} of size 8
   */
  function store64(a64) {
    var ba8 = new Uint8Array(8);
    for (var i = 0; i < 4; i++) {
      ba8[i] = (a64[LO32] >> (8 * i)) | 0;
    }
    for (var j = 4; j < 8; j++) {
      ba8[j] = (a64[HI32] >> (8 * j)) | 0;
    }
    return ba8;
  }

  /**
   * Rotate left Uint32Array(2)
   *
   * FIXME Allocate a new array. Do not modify the array provided as an input.
   *
   * @param a64 {Uint32Array} of size 2
   * @param n
   * @returns {Uint32Array} of size 2
   */
  function rotl64(a64, n) {
    n = (n % 64) | 0;

    var lo32 = a64[LO32];
    var hi32 = a64[HI32];

    if (n === 0) {
      return a64;
    } else if (n === 32) {
      a64[HI32] = lo32;
      a64[LO32] = hi32;
    } else if (n < 32) {
      a64[HI32] = (lo32 << n) | (hi32 >> (32 - n));
      a64[LO32] = (hi32 << n) | (lo32 >> (32 - n));
    } else if (n > 32) {
      n = (32 - n) | 0;
      a64[LO32] = (lo32 << n) | (hi32 >> (32 - n));
      a64[HI32] = (hi32 << n) | (lo32 >> (32 - n));
    }
    return a64;
  }

  var RANGE_5 = [0, 1, 2, 3, 4];
  var RANGE_7 = [0, 1, 2, 3, 4, 5, 6];

  // TODO Implement me
  function keccakF1600onLanes(lanes) {
    var R = 1;
    for (var round = 0; round < 24; round++) {
      // θ
      var C = RANGE_5.map(function (x) {
        // FIXME Uint64 xor
        return lanes[x][0] ^ lanes[x][1] ^ lanes[x][2] ^ lanes[x][3] ^ lanes[x][4];
      });
      var D = RANGE_5.map(function (x) {
        return C[(x + 4) % 5] ^ rotl64(C[(x + 1) % 5], 1); // FIXME Uint64 xor
      });
      lanes = RANGE_5.map(function (x) {
        return RANGE_5.map(function (y) {
          return [lanes[x][y] ^ D[x]]; // FIXME Uint64 xor
        });
      });
      // ρ and π
      var x = 1, y = 0;
      var current = lanes[x][y];
      for (var t = 0; t < 24; t++) {
        x = y;
        y = (2 * x + 3 * y) % 5;
        current = lanes[x][y];
        lanes[x][y] = rotl64(current, ((t + 1) * (t + 2) / 2) | 0);
      }
      // χ
      RANGE_5.forEach(function (y) {
        var T = RANGE_5.map(function (x) {
          return lanes[x][y];
        });
        RANGE_5.forEach(function (x) {
          // FIXME Implement a64 complement and a64 and
          lanes[x][y] = T[x] ^ ((~T[(x + 1) % 5]) & T[(x + 2) % 5]);
        });
      });
      // ι
      RANGE_7.forEach(function (j) {
        // FIXME Implement a64 shift right and shift left
        R = ((R << 1) ^ ((R >> 7) * 0x71)) % 256;
        if (R & 2) {
          lanes[0][0] = lanes[0][0] ^ (1 << ((1 << j) - 1));
        }
      });
    }
    return lanes;
  }//end of keccakF1600onLanes

  /**
   * TODO Add description
   *
   * @param state {Uint8Array} of size 200
   */
  function keccakF1600(state) {
    var lanes = RANGE_5.map(function (x) {
      return RANGE_5.map(function (y) {
        return load64(state.slice(8 * (x + 5 * y), 8 * (x + 5 * y) + 8));
      });
    });
    lanes = keccakF1600onLanes(lanes);
    state = new Uint8Array(200);
    RANGE_5.forEach(function (x) {
      RANGE_5.forEach(function (y) {
        var result = store64(lanes[x][y]);
        for (var i = 0; i < 8 * (x + 5 * y) + i < 8 * (x + 5 * y) + 8; i++) {
          state[8 * (x + 5 * y) + i] = result[i];
        }
      })
    });
    return state;
  }//end of keccakF1600

  /**
   * TODO Add description
   *
   * @param rate
   * @param capacity
   * @param inputBytes
   * @param delimitedSuffix
   * @param outputByteLen
   * @returns {ArrayBuffer}
   */
  function keccak(rate, capacity, inputBytes, delimitedSuffix, outputByteLen) {
    var outputBytes = new ArrayBuffer();
    var state = new ArrayBuffer(200);
    var rateInBytes = (rate / 8) | 0;
    var blockSize = 0;
    if (((rate + capacity) != 1600) || ((rate % 8) != 0)) {
      return;
    }
    var inputOffset = 0;
    // === Absorb all the input blocks ===
    while (inputOffset < inputBytes.length) {
      blockSize = Math.min(inputBytes.length - inputOffset, rateInBytes) | 0;
      for (var i = 0; i < blockSize; i++) {
        state[i] = state[i] ^ inputBytes[i + inputOffset];
      }
      inputOffset = (inputOffset + blockSize) | 0;
      if (blockSize === rateInBytes) {
        state = keccakF1600(state);
        blockSize = 0;
      }
    }
    // === Do the padding and switch to the squeezing phase ===
    state[blockSize] = state[blockSize] ^ delimitedSuffix;
    if (((delimitedSuffix & 0x80 != 0) && (blockSize == (rateInBytes - 1)))) {
      state = keccakF1600(state);
    }
    state[rateInBytes - 1] = state[rateInBytes - 1] ^ 0x80;
    state = keccakF1600(state);
    // === Squeeze out all the output blocks ===
    while (outputByteLen > 0) {
      blockSize = Math.min(outputByteLen, rateInBytes);
      outputBytes = outputBytes.concat(state.slice(0, blockSize));
      outputByteLen = outputByteLen - blockSize;
      if (outputByteLen > 0) {
        state = keccakF1600(state);
      }
    }
    return outputBytes;
  }//end of keccak

  return {
    "SHAKE128": function SHAKE128(inputBytes, outputByteLen) {
      return keccak(1344, 256, inputBytes, 0x1F, outputByteLen);
    },
    "SHAKE256": function SHAKE256(inputBytes, outputByteLen) {
      return keccak(1088, 512, inputBytes, 0x1F, outputByteLen);
    },
    "SHA3_224": function SHA3_224(inputBytes) {
      return keccak(1152, 448, inputBytes, 0x06, (224 / 8) | 0);
    },
    "SHA3_256": function SHA3_256(inputBytes) {
      return keccak(1088, 512, inputBytes, 0x06, (256 / 8) | 0);
    },
    "SHA3_384": function SHA3_384(inputBytes) {
      return keccak(832, 768, inputBytes, 0x06, (384 / 8) | 0);
    },
    "SHA3_512": function SHA3_512(inputBytes) {
      return keccak(576, 1024, inputBytes, 0x06, (512 / 8) | 0);
    },
    "_keccak": keccak,
    "_keccakF1600": keccakF1600,
    "_keccakF1600onLanes": keccakF1600onLanes,
    "_rotl64": rotl64,
    "_store64": store64,
    "_load64": load64
  };

}));