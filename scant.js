(function ($) {
  var Scant = function ($root) {
    this.$root = $root;
    this.currentActions = this.actions = [];
  };
  
  $.extend(Scant.prototype, {
    doMake: function (descriptor) {
      var newNode = $("<div style='position: absolute'/>"), match;
      
      while (match = descriptor.match(/^[#\.][A-Za-z0-9-_]+/)) {
        var value = match[0].slice(1);
        if (match[0].charAt(0) === "#") {
          newNode.attr("id", value);
        } else {
          newNode.addClass(value);
        }
        descriptor = descriptor.slice(match[0].length);
      }
      newNode.text(descriptor.trimLeft());
      this.$root.append(newNode);
      this.$current = newNode;
    },
    
    doAt: function (left, top) {
      this.$current.css({
        left: left,
        top: top
      });
    },
    
    go: function () {
      var that = this;
      this.actions.forEach(function (action) {
          action.func.apply(that, action.args);
      });
      return this;
    }
  });
  
  // Set up chaining functions to add to action list.
  ["make", "at"].forEach(function (chainFunc) {
    Scant.prototype[chainFunc] = function () {
      this.currentActions.push({
        func: this["do" + chainFunc.charAt(0).toUpperCase() + chainFunc.slice(1)],
        args: arguments
      });
      return this;
    };
  });
  
  $.fn.scant = function () {
    return new Scant(this);
  };
})(jQuery);