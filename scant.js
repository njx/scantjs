(function ($) {
  var Scant = function ($root) {
    this.$root = $root;
    this.currentActions = this.actions = [];
  };
  
  $.extend(Scant.prototype, {
    make: function (descriptor) {
      this.currentActions.push({
        func: this.doMake, 
        args: [descriptor]
      });
      return this;
    },
    
    doMake: function (descriptor) {
      var newNode = $("<div/>"), match;
      
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
    },
    
    go: function () {
      var that = this;
      this.actions.forEach(function (action) {
          action.func.apply(that, action.args);
      });
      return this;
    }
  });
  
  $.fn.scant = function () {
    return new Scant(this);
  };
})(jQuery);