var Acts=function(){function l(a,c){return a instanceof c}function m(a){return(a=/function (.+)\(/.exec(a.toString()))?a[1]:"[anonymous function]"}function n(a,c){if(!l(c,Object))throw Error("Obj to check was not a real object ("+c+")");var f,b,g,d,j;i=null;for(f in a){b=a[f];g=typeof b=="function"?l:e[b];if(!(!g||g(d=c[f],b,c,f)===true)){if(d===o||d===null)a=""+d;else{j={"[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date (ts:"+ +d+")"}[h.call(d)]||typeof d;a=j+(j=="function"?"":" ("+d+")")}if(g===l)b="instance of "+m(b);if(j==="object")a="instance of "+m(d.constructor);return!(i=["prop '",f,"' was not "+b+", but: ",a].join(""))}}return!!(i="Ok")}var i,o,p=/^\s*$/,h=Object.prototype.toString,k={},e={"type-string":function(a){return h.call(a)==="[object String]"},"type-number":function(a){return h.call(a)==="[object Number]"},"type-boolean":function(a){return h.call(a)==="[object Boolean]"},"type-array":function(a){return h.call(a)==="[object Array]"},"type-function":function(a){return h.call(a)==="[object Function]"},"type-regexp":function(a){return h.call(a)==="[object RegExp]"},"type-date":function(a){return h.call(a)==="[object Date]"},"value-null":function(a){return a===null},"value-undefined":function(a){return a===o},"value-true":function(a){return a===true},"value-false":function(a){return a===false},"positive-number":function(a){return e["type-number"](a)&&a>=0},"negative-number":function(a){return e["type-number"](a)&&a<0},integer:function(a){return e["type-number"](a)&&~~a===a},"positive-integer":function(a){return e["positive-number"](a)&&~~a===a},"negative-integer":function(a){return e.integer(a)&&a<0},"non-blank-string":function(a){return e["type-string"](a)&&!p.test(a)},"date-future":function(a){return e["type-date"](a)&&+new Date<+a},"date-past":function(a){return e["type-date"](a)&&+new Date>+a}};k.As=n;k.As.info=function(){return i};k.As.BuildTest=function(a){var c={},f=function(g){g=n(c,g);f.info=function(){return i};return g};for(var b in a)c[b]=a[b];return f};return k}();