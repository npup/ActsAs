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



module("API tests");
/*****************************************************
* "Real world"-like tests
******************************************************/
function MoodyWorker(grumpy, occupation) {
	this.grumpy = !!grumpy;
	this.occupation = occupation;
}
MoodyWorker.prototype.fire = function () {delete this.occupation;};
MoodyWorker.prototype.noogie = function () {this.grumpy = true;};
test("Static checks", function () {
	var grumpyUnemployed = {grumpy: "value-true", occupation: "value-undefined"}
	  , emptyObject = {}
	  , grumpyShoeShineBoy = new MoodyWorker(true, "shoe shine boy")
	  , happyUnemployed = new MoodyWorker(false);
	
	ok(!Acts.As(grumpyUnemployed, emptyObject), "Empty object is NOT a grumpy unemployed");
	equals(Acts.As.info(), "prop 'grumpy' was not value-true, but: undefined", "Correct mismatch msg for empty object vs 'grumpy unemployed'");
	ok(!Acts.As(grumpyUnemployed, grumpyShoeShineBoy), "Grumpy shoe shine boy is NOT a grumpy unemployed");
	equals(Acts.As.info(), "prop 'occupation' was not value-undefined, but: string (shoe shine boy)", "Correct mismatch msg for grumpy show shine boy vs 'grumpy unemployed'");
	ok(!Acts.As(grumpyUnemployed, happyUnemployed), "Happy unemployed is NOT a grumpy unemployed");
	equals(Acts.As.info(), "prop 'grumpy' was not value-true, but: boolean (false)", "Correct mismatch msg for happy unemployed vs 'grumpy unemployed'");

	emptyObject.grumpy = true; // grumpify pojo
	grumpyShoeShineBoy.fire(); // sack him
	happyUnemployed.noogie();  // piss him off
	ok(Acts.As(grumpyUnemployed, emptyObject), "Modified empty object into a grumpy unemployed - works!");
	equals(Acts.As.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");
	ok(Acts.As(grumpyUnemployed, grumpyShoeShineBoy), "Former grumpy shoe shine boy is suddenly a grumpy unemployed - works!");
	equals(Acts.As.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");
	ok(Acts.As(grumpyUnemployed, happyUnemployed), "Noogied happy unemployed is suddenly a grumpy unemployed - works!");
	equals(Acts.As.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");

});
test("Reusable signature", function () {
	var testGrumpyUnemployed = Acts.As.BuildTest({grumpy: "value-true", occupation: "value-undefined"})
	  , emptyObject = {}
	  , grumpyShoeShineBoy = new MoodyWorker(true, "shoe shine boy")
	  , happyUnemployed = new MoodyWorker(false);
	
	ok(!testGrumpyUnemployed(emptyObject), "Empty object is NOT a grumpy unemployed");
	equals(testGrumpyUnemployed.info(), "prop 'grumpy' was not value-true, but: undefined", "Correct mismatch msg for empty object vs 'grumpy unemployed'");
	ok(!testGrumpyUnemployed(grumpyShoeShineBoy), "Grumpy shoe shine boy is NOT a grumpy unemployed");
	equals(testGrumpyUnemployed.info(), "prop 'occupation' was not value-undefined, but: string (shoe shine boy)", "Correct mismatch msg for grumpy show shine boy vs 'grumpy unemployed'");
	ok(!testGrumpyUnemployed(happyUnemployed), "Happy unemployed is NOT a grumpy unemployed");
	equals(testGrumpyUnemployed.info(), "prop 'grumpy' was not value-true, but: boolean (false)", "Correct mismatch msg for happy unemployed vs 'grumpy unemployed'");
	
	emptyObject.grumpy = true; // grumpify pojo
	grumpyShoeShineBoy.fire(); // sack him
	happyUnemployed.noogie();  // piss him off
	ok(testGrumpyUnemployed(emptyObject), "Modified empty object into a grumpy unemployed - works!");
	equals(testGrumpyUnemployed.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");
	ok(testGrumpyUnemployed(grumpyShoeShineBoy), "Former grumpy shoe shine boy is suddenly a grumpy unemployed - works!");
	equals(testGrumpyUnemployed.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");
	ok(testGrumpyUnemployed(happyUnemployed), "Noogied happy unemployed is suddenly a grumpy unemployed - works!");
	equals(testGrumpyUnemployed.info(), "Ok", "Correct 'OK' message for testing a conforming grumpy enemployed");
});

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


module("Error message check");
/*****************************************************
* Error message check
******************************************************/
test("Work with real objects, bail on non objects", function () {
  function attempt(what) {try {Acts.As({}, what);}catch(err) {return err;} return true;}
  function nonObj(what) {ok(attempt(what) instanceof Error, "Bail when checking non-object: "+what+" ("+typeof what+")");}
  function realObj(what) {ok(attempt(what)===true, "Do work when checking real object: "+what+" ("+typeof what+")");}
  nonObj();
  nonObj(null);
  nonObj(true);
  nonObj(false);
  nonObj(5);
  nonObj(String(5));
  nonObj("ape");
  nonObj(String("ape"));
  realObj(new String("ape"));
  realObj(new Date());
});

})();
