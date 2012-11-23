module("scant", {
  setup: function () {
    this.$stage = $("#stage");
    this.scant = this.$stage.scant();

    var $target = $("<div id='test-target'></div>")
      .css({
        position: "absolute",
        left: 200,
        top: 300,
        width: 400,
        height: 500
      })
      .appendTo(this.$stage);

    this.assertHasDiv = function(selector) {
      var $node = $(selector, this.$stage);
      equal($node.length, 1, "made node with correct selector");
      equal($node.prop("tagName").toLowerCase(), "div", "made div node");
      return $node.get(0);
    }
  }
});

test("scant makes root position relative", function () {
  equal(this.$stage.css("position"), "relative", "root is position relative");
});
test("make creates do.make action", function () {
  this.scant.make("#myid");
  equal(this.scant.actions.length, 1, "has one action");
  equal(this.scant.actions[0].func, this.scant.do.make, "action is do.make");
  equal(this.scant.actions[0].args[0], "#myid", "arg is #myid");
});
test("go executes one mock action", function () {
  var called = false, origArg = "myarg", gotArg;
  this.scant.actions = [{
    func: function (funcArg) {
      called = true;
      gotArg = funcArg;
    },
    args: [origArg]
  }];
  this.scant.go();
  ok(called, "function was called");
  equal(gotArg, origArg, "function got right argument");
});
test("go executes real action", function () {
  this.scant.make("#myid").go();
  equal($("#myid", this.$stage).length, 1, "made div with id");    
});
test(".at() creates correct action", function () {
  this.scant.actions = [{
    func: function () {},
    args: ["myarg"]
  }];
  this.scant.at(100, 200);
  equal(this.scant.actions.length, 2, "has two actions");
  equal(this.scant.actions[1].func, this.scant.do.at, "action is do.at");
  equal(this.scant.actions[1].args[0], 100, "first arg is correct");
  equal(this.scant.actions[1].args[1], 200, "second arg is correct");
});
test(".make().at().go() creates and positions node", function () {
  this.scant.make("#myid").at(100, 200).go();
  var node = this.assertHasDiv("#myid");
  equal($(node).css("left"), "100px", "node left is correct");
  equal($(node).css("top"), "200px", "node top is correct");
});

test("do.make creates div with id, absolute position", function () {
  this.scant.do.make("#myid");
  var node = this.assertHasDiv("#myid");
  equal($(node).css("position"), "absolute", "node is absolutely positioned");
});
test("do.make creates class", function () {
  this.scant.do.make(".myclass");
  this.assertHasDiv(".myclass");
});
test("do.make creates node with ID before class", function () {
  this.scant.do.make("#myid.myclass");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".myclass");
  equal(node, node2, "same div has both the id and class");
});
test("do.make creates node with class before ID", function () {
  this.scant.do.make(".myclass#myid");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".myclass");
  equal(node, node2, "same div has both the id and class");
});
test("do.make creates node with ID and multiple classes", function () {
  this.scant.do.make("#myid.class1.class2");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".class1"),
      node3 = this.assertHasDiv(".class2");
  equal(node, node2, "same div has both the id and class");
  equal(node2, node3, "same div has both classes");
});
test("do.make creates node with ID and text", function () {
  this.scant.do.make("#myid some text");
  var node = this.assertHasDiv("#myid");
  equal($(node).text(), "some text", "div has proper text");
});
test("do.make sets $current", function () {
  this.scant.do.make("#myid");
  var node = this.assertHasDiv("#myid");
  equal(this.scant.do.$current[0], node, "created node is in $current");
});

test("do.at() positions current node", function () {
  this.scant.do.$current = $("<div></div>");
  this.scant.do.at(100, 200);
  equal(this.scant.do.$current.css("left"), "100px", "left is correct");
  equal(this.scant.do.$current.css("top"), "200px", "top is correct");
});
test("do.size() sets size of current node", function () {
  this.scant.do.$current = $("<div></div>");
  this.scant.do.size(200, 300);
  equal(this.scant.do.$current.css("width"), "200px", "left is correct");
  equal(this.scant.do.$current.css("height"), "300px", "top is correct");  
});
test("do.rightOf() places node default distance to right of target", function () {
  this.scant.do.$current = $("<div></div>");
  this.scant.do.rightOf("#test-target");
  equal(this.scant.do.$current.css("top"), "300px", "top aligned with target item");
  equal(this.scant.do.$current.css("left"), "620px", "item is to right of target by default spacing");
});
test("do.leftOf() places node default distance to left of target", function () {
  this.scant.do.$current = $("<div></div>").css({ width: 100, height: 100 });
  this.scant.do.leftOf("#test-target");
  equal(this.scant.do.$current.css("top"), "300px", "top aligned with target item");
  equal(this.scant.do.$current.css("left"), "80px", "item is to left of target by default spacing");
});
test("do.above() places node default distance above target", function () {
  this.scant.do.$current = $("<div></div>").css({ width: 100, height: 100 });
  this.scant.do.above("#test-target");
  equal(this.scant.do.$current.css("top"), "180px", "item is above target by default spacing");
  equal(this.scant.do.$current.css("left"), "200px", "left aligned with target item");
});
test("do.below() places node default distance below target", function () {
  this.scant.do.$current = $("<div></div>");
  this.scant.do.below("#test-target");
  equal(this.scant.do.$current.css("top"), "820px", "item is below target by default spacing");
  equal(this.scant.do.$current.css("left"), "200px", "left aligned with target item");
});

asyncTest("do.next() returns promise resolved on next click", function () {
  var finished = false;
  this.scant.do.next().done(function () {
    finished = true;
    ok(true, "click resolved promise");
    start();
  });
  
  setTimeout(function () {
    $(document.body).trigger("click");
  }, 1);
  setTimeout(function () {
    if (!finished) {
      ok(false, "promise never resolved");
      start();
    }
  }, 20);
});

test("go() yields at next()", function () {
  this.scant.next().make("#dont-make-me").go();
  equal($("#dont-make-me", this.$stage).length, 0, "nothing executed after next()");
});
