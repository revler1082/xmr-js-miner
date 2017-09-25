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
    return new Uint64(this.hi & x.hi, this.lo & x.lo);
  };

  /**

  */
  Uint64.prototype.or = function(x) {
    return new Uint64(this.hi | x.hi, this.lo | x.lo);
  };

  /**

  */
  Uint64.prototype.xor = function(x) {
    return new Uint64(this.hi ^ x.hi, this.lo ^ x.lo);
  };

  /**

  */
  Uint64.prototype.shiftLeft = function(x) {
    throw new Error('NOT YET IMPLEMENTED');
  };
  
  /**
  
  */
  Uint64.prototype.shiftRight = function(x) {
    throw new Error('NOT YET IMPLEMENTED');
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
