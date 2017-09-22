(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(function() {
      return (root.keccak = factory());
    });
  } else if(typeof module === "object" && module.exports) {
    module.exports = (root.keccak = factory());
  } else {
    root.keccak = factory();
  }
}(this, function() {
  
  var keccak = function(a, b) {
    
  };
  
  return {
    
    keccak1600: function(a, b) {
      
    }

  };
  
}));