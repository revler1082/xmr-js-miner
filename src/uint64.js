(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(function () {
      return (root.Uint64 = factory());
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = (root.Uint64 = factory());
  } else {
    root.Uint64 = factory();
  }
}(this, function () {
  "use strict";

  /**
  
  */
  var Uint64 = function(hi, lo) {

    var _hi, _lo;
    
    if(
      arguments.length === 2 && 
      typeof arguments[0] === 'number' &&
      typeof arguments[1] === 'number'
    ) {
      _hi = hi >>> 0;
      _lo = lo >>> 0;
    } else {
      throw new Error(
        'Invalid parameters passed to Uint64 constructor. ' + 
        'Constructor function must be called with exactly two parameters ' + 
        'of "number" type. Be mindful that all numbers will be coerced ' + 
        'to unsigned int, so passing negative/decimals will have unexpected ' +
        'results. '
      );
    }
    
    /**
    
    */
    Object.defineProperties(this, {
      'hi': {
        get: function() { return _hi; },
        set: function(val) {
          _hi = val | 0
        }
      },
      'lo': {
        get: function() { return _lo; },
        set: function(val) {
          _lo = val | 0
        }
      }
    });

  };
  
  /**
   * An indicator used to reliably determine if an object is a Uint64 or not.
   * @type {boolean}
   * @const
   * @private
   */
  Object.defineProperty(Uint64.prototype, "__isUint64__", {
      value: true,
      enumerable: false,
      configurable: false
  });
  
  /**
   * @function
   * @param {*} obj Object
   * @returns {boolean}
   * @inner
   */
  function _isUint64(obj) {
      return (obj && obj["__isUint64__"]) === true;
  };

  /**
  
  */
  Uint64.prototype.not = function() {
    return new Uint64(~this.hi, ~this.lo);
  };

  /**
  
  */
  Uint64.prototype.and = function(x) {
    if(!_isUint64(x)) {
      // todo: accept other parameters and just create uint64 from type
      throw new Error('argument must of type uint64');
    }
    
    return new Uint64(this.hi & x.hi, this.lo & x.lo);
  };

  /**

  */
  Uint64.prototype.or = function(x) {
    if(!_isUint64(x)) {
      // todo: accept other parameters and just create uint64 from type
      throw new Error('argument must of type uint64');
    }
    
    return new Uint64(this.hi | x.hi, this.lo | x.lo);
  };

  /**

  */
  Uint64.prototype.xor = function(x) {
    if(!_isUint64(x)) {
      // todo: accept other parameters and just create uint64 from type
      throw new Error('argument must of type uint64');
    }
    
    return new Uint64(this.hi ^ x.hi, this.lo ^ x.lo);
  };

  /**

  */
  Uint64.prototype.shiftLeft = function(numBits) {
    if(!numBits || typeof numBits !== 'number' || parseInt(numBits) < 0) {
      throw new Error('invalid argument type, shiftLeft expects positive number');
    }
    
    var cleanNumBits = parseInt(numBits); // already validated numBits as #
    
    // 0 is a no-op
    if(cleanNumBits === 0) return new Uint64(this.hi, this.lo);
    
    // if we shift left more than 32, then the entire low order is zero'd out..
    if(cleanNumBits >= 32) {
      return new Uint64( (this.lo << (cleanNumBits - 32)) >>> 0, 0);
    } else {
      return new Uint64( (this.hi << cleanNumBits) | (this.lo >>> (32 - cleanNumBits)), (this.lo << numBits) >>> 0);
    }
  };
  
  /**
  
  */
  Uint64.prototype.shiftRight = function(x) {
    if(!numBits || typeof numBits !== 'number' || parseInt(numBits) < 0) {
      throw new Error('invalid argument type, shiftRight expects positive number');
    }
    
    var cleanNumBits = parseInt(numBits); // already validated numBits as #
    
    // 0 is a no-op
    if(cleanNumBits === 0) return new Uint64(this.hi, this.lo);
    
    // if we shift right more than 32, then the entire high order is zero'd out..
    if(cleanNumBits >= 32) {
      return new Uint64(0, this.hi >> (cleanNumBits - 32));
    } else {
      return new Uint64( this.hi >>> 32, ( (this.lo >>> cleanNumBits) | (this.hi << (32 - cleanNumBits)) ) >>> 0 );
    }
  };
  
  /**
  
  */
  Uint64.prototype.getBinaryString = function() {
    var binStr = new Array(64);
    var i;
    for(i = 31; i >= 0; --i) binStr.push( (this.hi & (1 << i)) === (1 << i) ? '1' : '0' );
    for(i = 31; i >= 0; --i) binStr.push( (this.lo & (1 << i)) === (1 << i) ? '1' : '0' );
    return binStr.join('');
  };
  
  return Uint64;
  
}));
