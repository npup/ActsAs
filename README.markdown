ActsAs
=========

#### A JavaScript duck typing checker module ####

Mission statement
-----------------
When operating on an object in JavaScript, one often wants to check for the object's capabilities instead of its origin.
This means checking for it having a couple of specified properties, instead of doing something like `obj instanceof Foo` - sometimes there isn't even a `Foo` constructor to check for.


Of course this could be taken *really seriously*, leading to writing veritable unit tests for the poor object that wants to quack for us.
A middle ground is checking for *existence and type* of the properties that make an object able to quack like the duck of your choice.

*This module is meant to make it easy to set up such a quacking standard, and check objects for conformance.*



Using ActsAs
------------

Obviously, you need to include the file `ActsAs.js`.

Then, create a `signature` for the characteristics you are after. A signaure is an object with a defined characteristic for each property you are interested in validating.

    // an entity with name and age, is insane and can perform lambada
    var insaneLambadaEnabled = {
      name: "type-string"
      , age: "type-number"
      , lambada: "type-function"
      , insane: "value-true"
    };

Check for conformance with this signature by calling Acts.As(signature, obj):

    function foo(obj) {
      if (!Acts.As(insaneLambadaEnabled, obj)) return; // failing early. no lambada for you, obj!
      console.log("I hereby announce our next contestant, an insane lambada dancer named "+obj.name+"!");
      obj.lambada();
    }
    
    // A dedicated lambadaist constructor
    function Lambadaist(name, age, insane) {
      this.name = name;
      this.age = age;
      this.insane = !!insane;
    }
    Lambadaist.prototype.lambada = function () {
      return console.log(this.name+": NAAA NA-NA-NA-NAAA...");
    };
    
    // Middle-aged and insane object named Ljörgen has lambada chops
    foo({name:"Ljörgen", age: 47, insane: true, lambada: function () {console.log(this.name+": Naaa na-na-na-naaa... (ducky)");}});
    // A card carrying Lambdaist obj has lambada chops..
	var lambadaist = new Lambadaist("Kalenderhielm", 56, true);
    foo(lambadaist);  // ok
	// .. after being on medication for a while, no longer applicable for foo()
	lambadaist.insane = false;
	foo(lambadaist); // throws

    


The result is `true`, or `false`. In the case of `false`, you might be interested in what went wrong. Failure info (first point of failure), is available via `Acts.As.info()`.

Here's how to use conformance failure info for debugging or whatever:

    function bar(obj) {
      if (!Acts.As(insaneLambadaEnabled, obj)) {throw Error(Acts.As.info());}
      obj.lambada();
    }

    // will throw with msg "prop 'insane' was not value-true, but: string (TRUE)"
    bar({name:"Ljörgen", age: 47, insane: "TRUE", lambada: function () {console.log(this.name+": Naaa na-na-na-naaa... (ducky)");}});


Characteristics
---------------

Out of the box, a signature explicitly supports the following property characteristics:
	
*Types*

   	"type-string"
    "type-number"
    "type-function"
    "type-regexp"
    "type-array"
	"type-date"
	"type-boolean"      // any boolean will do

*Values*

	"value-true"        // property must be === true
    "value-false"       // property must be === false
    "value-null"        // property must be === null
    "value-undefined"   // property must not be defined

*Constrained values*

	"positive-number"
    "negative-number"
	"integer"
	"positive-integer"
	"negative-integer"
	"non-blank-string"
	
*Constructors*

	Foo		// property must be instanceof Foo
	
The constructor validating thing is demonstrated in the `logGrunt.signature` below.
We also see how one could go about validating function parameters in general:
	
	function logGrunt(ape, what) {
	  if (!Acts.As(logGrunt.signature, {"gruntee": ape, "what": what})) {throw Error(Acts.As.info());}
	  console.log(ape.grunt(what));
	}
	logGrunt.signature = {
	  "gruntee": Ape
	  , "what": "non-blank-string"
	};
	function Ape(name) {
	  this.name = name;
	}
	Ape.prototype.grunt = function (what) {return this.name+ " grunts: '"+what+"'";};

	logGrunt(new Ape("Ljörgen"), "fool.."); // ok
	logGrunt("Ljörgen", "fool.."); // throws



Custom validations are coming up when I decided on a nice API for it...


Tip
---

As shown above, a nice place for signatures can be on a function that is meant to operate on just a certain breed of objects.


Happy ducktyping!  
/me
