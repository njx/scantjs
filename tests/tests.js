module("basics", {
  setup: function () {
    this.$stage = $("#stage");
    this.scant = this.$stage.scant();
    
    this.assertHasDiv = function(selector) {
      var $node = $(selector, this.$stage);
      equal($node.length, 1, "made node with correct selector");
      equal($node.prop("tagName").toLowerCase(), "div", "made div node");
      return $node.get(0);
    }
  }
});

test("make creates doMake action", function () {
  this.scant.make("#myid");
  equal(this.scant.currentActions.length, 1, "has one action");
  equal(this.scant.currentActions[0].func, this.scant.doMake, "action is doMake");
  equal(this.scant.currentActions[0].args[0], "#myid", "arg is #myid");
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
  this.scant.currentActions = this.scant.actions = [{
    func: function () {},
    args: ["myarg"]
  }];
  this.scant.at(100, 200);
  equal(this.scant.currentActions.length, 2, "has two actions");
  equal(this.scant.currentActions[1].func, this.scant.doAt, "action is doAt");
  equal(this.scant.currentActions[1].args[0], 100, "first arg is correct");
  equal(this.scant.currentActions[1].args[1], 200, "second arg is correct");
});
test(".make().at().go() creates and positions node", function () {
  this.scant.make("#myid").at(100, 200).go();
  var node = this.assertHasDiv("#myid");
  equal($(node).css("left"), "100px", "node left is correct");
  equal($(node).css("top"), "200px", "node top is correct");
});

test("doMake creates div with id, absolute position", function () {
  this.scant.doMake("#myid");
  var node = this.assertHasDiv("#myid");
  equal($(node).css("position"), "absolute", "node is absolutely positioned");
});
test("doMake creates class", function () {
  this.scant.doMake(".myclass");
  this.assertHasDiv(".myclass");
});
test("doMake creates node with ID before class", function () {
  this.scant.doMake("#myid.myclass");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".myclass");
  equal(node, node2, "same div has both the id and class");
});
test("doMake creates node with class before ID", function () {
  this.scant.doMake(".myclass#myid");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".myclass");
  equal(node, node2, "same div has both the id and class");
});
test("doMake creates node with ID and multiple classes", function () {
  this.scant.doMake("#myid.class1.class2");
  var node = this.assertHasDiv("#myid"),
      node2 = this.assertHasDiv(".class1"),
      node3 = this.assertHasDiv(".class2");
  equal(node, node2, "same div has both the id and class");
  equal(node2, node3, "same div has both classes");
});
test("doMake creates node with ID and text", function () {
  this.scant.doMake("#myid some text");
  var node = this.assertHasDiv("#myid");
  equal($(node).text(), "some text", "div has proper text");
});
test("doMake sets $current", function () {
  this.scant.doMake("#myid");
  var node = this.assertHasDiv("#myid");
  equal(this.scant.$current[0], node, "created node is in $current");
});

test("doAt() positions current node", function () {
  this.scant.$current = $("<div></div>");
  this.scant.doAt(100, 200);
  equal(this.scant.$current.css("left"), "100px", "left is correct");
  equal(this.scant.$current.css("top"), "200px", "top is correct");
});