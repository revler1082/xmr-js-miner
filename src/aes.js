(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(function () {
      return (root.aes = factory());
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = (root.aes = factory());
  } else {
    root.aes = factory();
  }
}(this, function () {
  "use strict";
  
  var _keyLengthToCycleCount = {
    '128': 10,
    '192': 12,
    '256': 14
  };
  
  /**
  
  */
  var subBytes = function(state) {

  };

  /**
  
  */
  var shiftRows = function(state) {
    
  };

  /**
  
  */
  var mixColumns = function(state) {
    
  };
  
  return {
    
    /**
    * @bytes Uint8Array
    */
    round: function(state) {

    }
  };
  
});
