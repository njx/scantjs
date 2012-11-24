(function ($) {
  var Scant = function ($root, defaults) {
    this.do.defaults = $.extend({
      spacing: 20
    }, defaults);
    
    // actions set up by chained calls
    this.actions = [];
        
    this.do.init($root);
  };
  
  $.extend(Scant.prototype, {
    // The execution context that performs the actions set up by the initial chained calls
    // to Scant. The actual chained functions are set up automatically based on the action
    // functions available on the "do" object.
    do: {
      init: function ($root) {
        // root node of our display
        this.$root = $root.css("position", "relative");
        
        // node being operated on
        this.$current = null;
        
        // outstanding promises
        this.promises = [];
        
        // index of current action
        this.currentAction = 0;       
    
        // bind methods
        this._go = this._go.bind(this);
      },

      make: function (descriptor) {
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
      
      at: function (left, top) {
        this.$current.css({
          left: left,
          top: top
        });
      },
      
      size: function (width, height) {
        this.$current.css({
          width: width,
          height: height
        });
      },
      
      connect: function () {
        // *** TODO: no-op for now
      },
      
      fadeIn: function () {
        // *** TODO: no-op for now
      },
      
      rightOf: function (target) {
        var $target = $(target);
        this.$current.css({
          left: $target.position().left + $target.outerWidth() + this.defaults.spacing,
          top: $target.position().top
        });
      },
  
      leftOf: function (target) {
        var $target = $(target);
        this.$current.css({
          left: $target.position().left - this.defaults.spacing - this.$current.outerWidth(),
          top: $target.position().top
        });
      },
      
      above: function (target) {
        var $target = $(target);
        this.$current.css({
          left: $target.position().left,
          top: $target.position().top - this.defaults.spacing - this.$current.outerHeight()
        });
      },
      
      below: function (target) {
        var $target = $(target);
        this.$current.css({
          left: $target.position().left,
          top: $target.position().top + $target.outerHeight() + this.defaults.spacing
        });
      },
      
      next: function () {
        var deferred = $.Deferred();
        $(document.body).click(function () {
          deferred.resolve();
        });
        return {wait: true, promise: deferred.promise()};
      },
      
      _go: function () {
        var promise, action;
        while (this.currentAction < this.actions.length) {
          action = this.actions[this.currentAction++];
          result = action.func.apply(this, action.args);
          if (result && result.promise) {
            if (result.wait) {
              // This function wants us to wait until its promise is resolved.
              result.promise.done(this._go);
              break;
            } else {
              // Don't wait till it's done, but remember the promise in case a later
              // function wants to wait on it.
              this.promises.push(result.promise);
            }
          }
        }
      },
    },
        
    go: function () {
      this.do.actions = this.actions;
      this.do._go();
      return this;
    }
  });
  
  // Set up chaining functions to add to action list.
  Object.keys(Scant.prototype.do).forEach(function (key) {
    if (key.charAt(0) != "_") {
      Scant.prototype[key] = function () {
        this.actions.push({
          func: this.do[key],
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