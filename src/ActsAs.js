var Acts = (function () {
var INFO, none, BLANK = /^\s*$/, _opts = Object.prototype.toString, API = {}
, checks = {
	"type-string": 				function (v) {return _opts.call(v)==="[object String]";}
  , "type-number": 			function (v) {return _opts.call(v)==="[object Number]";}
  , "type-boolean": 		function (v) {return _opts.call(v)==="[object Boolean]";}
  , "type-array": 			function (v) {return _opts.call(v)==="[object Array]";}
  , "type-function": 		function (v) {return _opts.call(v)==="[object Function]";}
  , "type-regexp": 			function (v) {return _opts.call(v)==="[object RegExp]";}
  , "type-date": 				function (v) {return _opts.call(v)==="[object Date]";}
  , "value-null": 			function (v) {return v===null;}
  , "value-undefined": 	function (v) {return v===none;}
  , "value-true": 			function (v) {return v===true;}
  , "value-false": 			function (v) {return v===false;}
  , "positive-number": 	function (v) {return checks["type-number"](v) && v>=0;}
  , "negative-number": 	function (v) {return checks["type-number"](v) && v<0;}
  , "integer": 				 	function (v) {return checks["type-number"](v) && ~~v===v;}
  , "positive-integer": function (v) {return checks["positive-number"](v) && ~~v===v;}
  , "negative-integer": function (v) {return checks["integer"](v) && v<0;}
  , "non-blank-string": function (v) {return checks["type-string"](v) && !BLANK.test(v);}
  , "date-future": 			function (v) {return checks["type-date"](v) && (+(new Date)<+v);}
  , "date-past": 				function (v) {return checks["type-date"](v) && (+(new Date)>+v);}
};
function instanceCheck(propValue, obj, prop, type) {return propValue instanceof type;}
function fn(f) {var re = /function (.+)\(/, m = re.exec(f.toString()); return m ? m[1] : "[anonymous function]";}
function checkSignature(signature, obj) {
  var prop, wantedCheck, check, actualValue, actualType, actualString;
  INFO = null;
  for (prop in signature) {
	  wantedCheck = signature[prop];
	  check = (typeof wantedCheck=="function") ? instanceCheck : checks[wantedCheck];
	  if (!check || check(actualValue = obj[prop], obj, prop, wantedCheck)===true) {continue;} // prop ok, go on
	  if (actualValue===none || actualValue===null) {actualString = ""+actualValue;}
	  else {
		  actualType = {"[object RegExp]": "regexp", "[object Array]": "array", "[object Date]": "date (ts:"+(+actualValue)+")"}[_opts.call(actualValue)] || typeof actualValue;
		  actualString =  actualType + ((actualType=="function") ? "" : " ("+actualValue+")");
	  }
	  if (check===instanceCheck) {wantedCheck = "instance of "+fn(wantedCheck);}
	  if (actualType==="object") {actualString = "instance of "+fn(actualValue.constructor);}
	  return !(INFO = ["prop '", prop, "' was not "+wantedCheck+", but: ", actualString].join("")); // false
  }
  return !!(INFO = "Ok"); // true
}
API.As = checkSignature;
API.As.info = function () {return INFO;};
return API;
})();
