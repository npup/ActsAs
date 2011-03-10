(function () {

// Example model
function Mud(server, port) {
  this.server = server;
  this.port = port;
}

var TestRunner = (function() {
var t0 = new Date(2003, 1, 28)
, t1 = new Date(2043, 1, 28)
 , mud = new Mud("grimne.org", 4000)
, tests = {
  "string (foo)":
      {value:"foo",       tags: {"type-string": true, "non-blank-string": true}}
      
  , "string ()":
      {value:"",          tags: {"type-string": true}}
      
  , "number (42)":
      {value:42,          tags: {"type-number": true, "integer": true, "positive-number": true, "positive-integer": true}}
      
  , "number (-42)":
      {value:-42,         tags: {"type-number": true, "integer": true, "negative-number": true, "negative-integer": true}}
      
  , "number (42.5)":
      {value:42.5,        tags: {"type-number": true, "positive-number": true}}
      
  , "number (-42.5)":
      {value:-42.5,       tags: {"type-number": true, "negative-number": true}}
      
  , "boolean (true)":
      {value:true,        tags: {"type-boolean": true, "value-true": true}}
      
  , "boolean (false)":
      {value:false,       tags: {"type-boolean": true, "value-false": true}}
      
  , "array (1,2,3)":
      {value:[1,2,3],     tags: {"type-array": true}}
      
  , "function":
      {value:function(){},tags: {"type-function": true}}
      
  , "regexp":           
      {value: /foo/,      tags: {"type-regexp": true}, trunc: true}
      
  , "undefined":        
      {value: undefined,  tags: {"value-undefined": true}}
      
  , "null":
      {value: null,       tags: {"value-null": true}}
};

tests["date (ts:"+(+t0)+")"] =
      {value: t0,         tags: {"type-date": true, "date-past": true}, trunc: true};
tests["date (ts:"+(+t1)+")"] =
      {value: t1,         tags: {"type-date": true, "date-future": true}, trunc: true};
      
tests["instance of Mud"] =
      {value: mud,  tags: {"instance-of-Mud": true}};

var _opts = Object.prototype.toString;
function fn(f) {var re = /function (.+)\(/, m = re.exec(f.toString()); return m ? m[1] : "[anonymous function]";}
function loop(obj, process) {for (var prop in obj) {process(obj, prop);}}
function run(conf) {
  var propName = "p"
    , instanceCheck = (typeof conf[propName]=="function") ? ("instance of " + fn(conf[propName])) : "";
  loop(tests, function (tests, testName) {
    var data = tests[testName], testObj = {}, val;
    testObj[propName] = val = data.value;
    var result = Acts.As(conf, testObj)
      , expectedMsg, actualMsg;
    if (data.tags[conf[propName]] || data.tags[conf.tag]) {ok(result, "OK - "+testName);}
    else {
      expectedMsg = "prop '"+propName+"' was not "+(instanceCheck?instanceCheck:conf[propName]);
      expectedMsg += (", but: "+ testName);
      actualMsg = Acts.As.info();
      if (data.trunc) {actualMsg = actualMsg.substring(0, expectedMsg.length);}
      equal(actualMsg, expectedMsg, "With "+testName);
    }
  });
}
return {run: run};
})();

module("Type");
/*****************************************************
* Checks on the various types
******************************************************/
test("String", function () {
  TestRunner.run({p: "type-string"});
});

test("Number", function () {
  TestRunner.run({p: "type-number"});
});

test("Boolean", function () {
  TestRunner.run({p: "type-boolean"});
});

test("Array", function () {
  TestRunner.run({p: "type-array"});
});

test("Function", function () {
  TestRunner.run({p: "type-function"});
});

test("RegExp", function () {
  TestRunner.run({p: "type-regexp"});
});

test("Date", function () {
  TestRunner.run({p: "type-date"});
});


module("Value");
/*****************************************************
* Checks on values
******************************************************/
test("undefined", function () {
  TestRunner.run({p: "value-undefined"});
});

test("null", function () {
  TestRunner.run({p: "value-null"});
});

test("true", function () {
  TestRunner.run({p: "value-true"});
});

test("false", function () {
  TestRunner.run({p: "value-false"});
});


module("Constrained value");
/*****************************************************
* Special checks on values
******************************************************/
test("non-blank string", function () {
  TestRunner.run({p: "non-blank-string"});
});

test("positive number", function () {
  TestRunner.run({p: "positive-number"});
});

test("negative number", function () {
  TestRunner.run({p: "negative-number"});
});

test("integer", function () {
  TestRunner.run({p: "integer"});
});

test("positive integer", function () {
  TestRunner.run({p: "positive-integer"});
});

test("negative integer", function () {
  TestRunner.run({p: "negative-integer"});
});

test("past date", function () {
  TestRunner.run({p: "date-past"});
});

test("future date", function () {
  TestRunner.run({p: "date-future"});
});


module("Instance check");
/*****************************************************
* Instance check
******************************************************/
test("instance of Mud", function () {
  TestRunner.run({p: Mud, tag:"instance-of-Mud"});
});


})();
