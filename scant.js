(function ($) {
  var Scant = function ($root, defaults) {
    this.defaults = $.extend({
      spacing: 20
    }, defaults);
    this.$root = $root.css("position", "relative");
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
    
    doSize: function (width, height) {
      this.$current.css({
        width: width,
        height: height
      });
    },
    
    doConnect: function () {
      // *** TODO: no-op for now
    },
    
    doRightOf: function (target) {
      var $target = $(target);
      this.$current.css({
        left: $target.position().left + $target.outerWidth() + this.defaults.spacing,
        top: $target.position().top
      });
    },

    doLeftOf: function (target) {
      var $target = $(target);
      this.$current.css({
        left: $target.position().left - this.defaults.spacing - this.$current.outerWidth(),
        top: $target.position().top
      });
    },
    
    doAbove: function (target) {
      var $target = $(target);
      this.$current.css({
        left: $target.position().left,
        top: $target.position().top - this.defaults.spacing - this.$current.outerHeight()
      });
    },
    
    doBelow: function (target) {
      var $target = $(target);
      this.$current.css({
        left: $target.position().left,
        top: $target.position().top + $target.outerHeight() + this.defaults.spacing
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
  Object.keys(Scant.prototype).forEach(function (key) {
    if (key.substr(0, 2) === "do" && key.charAt(2).toUpperCase() === key.charAt(2)) {
      var chainFunc = key.charAt(2).toLowerCase() + key.slice(3);
      Scant.prototype[chainFunc] = function () {
        this.currentActions.push({
          func: this[key],
          args: arguments
        });
        return this;
      };
    }
  });
  
  $.fn.scant = function (defaults) {
    return new Scant(this, defaults);
  };
})(jQuery);