parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Oxyk":[function(require,module,exports) {
module.exports=["do",["def","new",["fn",["a","&","b"],[".","Reflect",["`","construct"],"a","b"]]],["def","del",["fn",["a","b"],[".","Reflect",["`","deleteProperty"],"a","b"]]],["def","list",["fn",["&","a"],"a"]],["def",">=",["fn",["a","b"],["if",["<","a","b"],!1,!0]]],["def",">",["fn",["a","b"],["if",[">=","a","b"],["if",["=","a","b"],!1,!0],!1]]],["def","<=",["fn",["a","b"],["if",[">","a","b"],!1,!0]]],["def","classOf",["fn",["a"],[".",[".-",[".-","Object",["`","prototype"]],["`","toString"]],["`","call"],"a"]]],["def","not",["fn",["a"],["if","a",!1,!0]]],["def","null?",["fn",["a"],["=",null,"a"]]],["def","true?",["fn",["a"],["=",!0,"a"]]],["def","false?",["fn",["a"],["=",!1,"a"]]],["def","string?",["fn",["a"],["if",["=","a",null],!1,["=",["`","String"],[".-",[".-","a",["`","constructor"]],["`","name"]]]]]],["def","pr-str",["fn",["&","a"],[".",["map",[".-","JSON",["`","stringify"]],"a"],["`","join"],["`"," "]]]],["def","str",["fn",["&","a"],[".",["map",["fn",["x"],["if",["string?","x"],"x",[".","JSON",["`","stringify"],"x"]]],"a"],["`","join"],["`",""]]]],["def","prn",["fn",["&","a"],["do",[".","console",["`","log"],[".",["map",[".-","JSON",["`","stringify"]],"a"],["`","join"],["`"," "]]],null]]],["def","println",["fn",["&","a"],["do",[".","console",["`","log"],[".",["map",["fn",["x"],["if",["string?","x"],"x",[".","JSON",["`","stringify"],"x"]]],"a"],["`","join"],["`"," "]]],null]]],["def","list?",["fn",["a"],[".","Array",["`","isArray"],"a"]]],["def","contains?",["fn",["a","b"],[".","a",["`","hasOwnProperty"],"b"]]],["def","get",["fn",["a","b"],["if",["contains?","a","b"],[".-","a","b"],null]]],["def","set",["fn",["a","b","c"],["do",[".-","a","b","c"],"a"]]],["def","keys",["fn",["a"],[".","Object",["`","keys"],"a"]]],["def","vals",["fn",["a"],[".","Object",["`","values"],"a"]]],["def","cons",["fn",["a","b"],[".",["`",[]],["`","concat"],["list","a"],"b"]]],["def","concat",["fn",["&","a"],[".",[".-",["list"],["`","concat"]],["`","apply"],["list"],"a"]]],["def","nth","get"],["def","first",["fn",["a"],["if",[">",[".-","a",["`","length"]],0],["nth","a",0],null]]],["def","last",["fn",["a"],["nth","a",["-",[".-","a",["`","length"]],1]]]],["def","count",["fn",["a"],[".-","a",["`","length"]]]],["def","empty?",["fn",["a"],["if",["list?","a"],["=",0,[".-","a",["`","length"]]],["=","a",null]]]],["def","slice",["fn",["a","b","&","end"],[".","a",["`","slice"],"b",["if",[">",[".-","end",["`","length"]],0],["get","end",0],[".-","a",["`","length"]]]]]],["def","rest",["fn",["a"],["slice","a",1]]],["def","and",["~",["fn",["&","xs"],["if",["empty?","xs"],!0,["if",["=",1,[".-","xs",["`","length"]]],["first","xs"],["list",["`","let"],["list",["`","__and"],["first","xs"]],["list",["`","if"],["`","__and"],["concat",["`",["and"]],["rest","xs"]],["`","__and"]]]]]]]],["def","or",["~",["fn",["&","xs"],["if",["empty?","xs"],null,["if",["=",1,[".-","xs",["`","length"]]],["first","xs"],["list",["`","let"],["list",["`","__or"],["first","xs"]],["list",["`","if"],["`","__or"],["`","__or"],["concat",["`",["or"]],["rest","xs"]]]]]]]]],null];
},{}],"Tbsw":[function(require,module,exports) {
var global = arguments[3];
var n=arguments[3];function e(n){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}var r=this&&this.__spreadArrays||function(){for(var n=0,e=0,r=arguments.length;e<r;e++)n+=arguments[e].length;var t=Array(n),o=0;for(e=0;e<r;e++)for(var a=arguments[e],i=0,u=a.length;i<u;i++,o++)t[o]=a[i];return t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.TheGlobal=exports.ContinuablePromise=exports.EnvWrapper=exports.Interpreter=exports.findEnv=exports.setEnv=exports.newEnv=exports.isContinuation=exports.isApplicable=exports.isHalfMacro=exports.isMacro=exports.isLambda=exports.isEnv=exports.isBOR=exports.isPromiseLike=exports.cloneAST=exports.VERSION=exports.LANGUAGE=void 0,exports.LANGUAGE="Continuable-miniMAL-Lisp",exports.VERSION="0.4.3",exports.cloneAST=function(n,r){if(void 0===r&&(r=new Map),r.has(n))return r.get(n);if("object"===e(n)&&null!==n&&n.constructor===Object)return Object.keys(n).reduce(function(e,t){return e[t]=exports.cloneAST(n[t],r),e},{});if(n instanceof Array){var t=r.set(n,[]).get(n);return t.push.apply(t,n.map(function(n){return exports.cloneAST(n,r)})),t}return n};var t=function(n){throw n},o=function(n){"object"===e(n)&&null!==n&&Object.keys(n).filter(function(e){return void 0===n[e]}).forEach(function(e){return delete n[e]})};exports.isPromiseLike=function(n){return!!n&&("object"===e(n)||"function"==typeof n)&&"function"==typeof n.then};var a=function(n){return"string"==typeof n||t(n+" is not a symbol")},i=function(n){return"string"==typeof n||"symbol"===e(n)||"number"==typeof n||t("String(x) is not a property index")};exports.isBOR=function(n,r){return"object"===e(r)&&null!==r&&"string"==typeof r.bor&&r.constructor===Object&&1===Object.keys(r).length&&r.bor in n};var u=function(n){return n instanceof Array},s=function(n){return u(n)||t(n+" is not an array")};exports.isEnv=function(n){return n instanceof Array&&"object"===e(n[0])&&null!==n[0]&&(n[1]instanceof Array||null===n[1])},exports.isLambda=function(n){return n instanceof Array&&"=>"===n[0]&&4===n.length&&exports.isEnv(n[3])&&n[1]instanceof Array&&n[1].every(function(n){return"string"==typeof n})},exports.isMacro=function(n){return n instanceof Array&&"~"===n[0]&&2===n.length&&exports.isApplicable(n[1])},exports.isHalfMacro=function(n){return n instanceof Array&&"~~"===n[0]&&2===n.length&&exports.isApplicable(n[1])};var l=function(n){return"function"==typeof n};exports.isApplicable=function(n){return exports.isLambda(n)||l(n)||exports.isContinuation(n)||exports.isMacro(n)||exports.isHalfMacro(n)};var f=function(n){return exports.isApplicable(n)||t(n+" is not a applicable")},c=function(n){return exports.isMacro(n)||t(n+" is not a macro")},v=function(n){return exports.isHalfMacro(n)||t(n+" is not a half macro")},p=function(n){return"object"===e(n)&&null!==n&&n.parent instanceof Array&&"number"==typeof n.index&&exports.isEnv(n.env)&&(null===n.flag||"string"==typeof n.flag)&&"object"===e(n.handler)};exports.isContinuation=function(n){return"object"===e(n)&&null!==n&&p(n.current)&&n.stack instanceof Array&&"string"==typeof n.version&&n.version.replace(/\.[^.]+$/,"")===exports.VERSION.replace(/\.[^.]+$/,"")};var d=function(n){return exports.isContinuation(n)||t(n+" is not a continuation")},h=function(n){return n instanceof Array&&"fn"===n[0]&&3===n.length&&n[1]instanceof Array&&n[1].every(function(n){return"string"==typeof n})||t(n+" is not a fn form or malformed")},g=function(n){return n instanceof Array&&"try"===n[0]&&n[2]instanceof Array&&"string"==typeof n[2][1]&&n[2].length>=3||t(n+" is not a try form or malformed")},x=function(n){return n instanceof Array&&"let"===n[0]&&n[1]instanceof Array&&n.length>=3||t(n+" is not a let form or malformed")},b=function(n){return n instanceof Array&&"dynamic-let"===n[0]&&n[1]instanceof Array&&n.length>=3||t(n+" is not a let form or malformed")};exports.newEnv=function(n,e,r,t){void 0===t&&(t=!0);for(var o={},a=0;a<e.length;a++){if(t&&"&"===e[a]){o[""+e[a+1]]=r.slice(a);break}o[""+e[a]]=r[a]}return[o,n]},exports.setEnv=function(n,e,r){return n[0][""+e]=r},exports.findEnv=function(n,r,t){for(var o=n;o;o=o[1]){if(o[0].hasOwnProperty(t))return[o[0][t],!0,!1];if(!o[1]&&r&&t in r&&null!==r[t]&&("object"===e(r[t])||"function"==typeof r[t]))return[{bor:t},!0,!0]}return[null,!1,!1]};var y=function n(e){return e[1]?n(e[1]):e},m=function(){return function(n){var e=this;if(this.stackMax=1/0,this.base=R,this.env=[{},null],this.dynamicEnv=[{},null],this.loadCore=!0,this.debugCount=0,this.debugMode=!1,this.debugCore=!1,this.debugMax=1/0,this.debugFilter=function(){return!0},this.debug=function(n){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];if(e.debugMode&&e.debugFilter(n)&&(t=t.map(function(n){return n instanceof Array?exports.cloneAST(n):n}),console.log.apply(console,r([n],t)),e.debugCount++,e.debugCount>e.debugMax))throw new Error("too many debug message!")},this.evalAST=function(n,o,a){void 0===o&&(o=e.env),void 0===a&&(a=e.dynamicEnv);for(var i=[n],s=[{parent:i,index:0,env:o,dynamicEnv:a,flag:null,handler:null}],l=function(n){return s.length>=e.stackMax?t("Stack overflow"):(s.push(n),n)},f=function(){e.debug("Current eval-stack length, eval-stack: ",s.length,s);var n=s.pop(),o=n.parent,a=n.index,i=n.env,f=n.dynamicEnv,c=n.flag,v=n.handler,p=o[a];e.debug("Next evaluating AST node, env, dynamicEnv, flag: ",p,i,f,c);try{if("string"==typeof p){var d=exports.findEnv(i,e.base,p),h=d[0],x=d[1];o[a]=x?h:t(p+" not found")}else if(u(p)){var b="string"==typeof p[0]?e.derefBOR(exports.findEnv(i,e.base,p[0])[0]):null,y=(exports.isMacro(b)?w:exports.isHalfMacro(b)||exports.isHalfMacro(e.derefBOR(p[0]))&&c?A:"string"==typeof p[0]&&S.hasOwnProperty(p[0])?S[p[0]]:exports.isContinuation(p[0])||exports.isContinuation(b)?O:E)({node:p,env:i,base:e.base,dynamicEnv:f,flag:c,handler:v,cont:{current:n,stack:s,lang:exports.LANGUAGE,version:exports.VERSION,info:null},interpreter:e}),m=y.ret,j=y.subevals,R=y.reevals;null==R||R.reverse().forEach(function(n){var e,r,t,u,s,c;return l({parent:null!==(e=n.parent)&&void 0!==e?e:o,index:null!==(r=n.index)&&void 0!==r?r:a,env:null!==(t=n.env)&&void 0!==t?t:i,dynamicEnv:null!==(u=n.dynamicEnv)&&void 0!==u?u:f,flag:null!==(s=n.flag)&&void 0!==s?s:null,handler:null!==(c=n.handler)&&void 0!==c?c:v})}),null==j||j.reverse().forEach(function(n){var e,r,t,u,s,c;return n&&l({parent:null!==(e=n.parent)&&void 0!==e?e:o,index:null!==(r=n.index)&&void 0!==r?r:a,env:null!==(t=n.env)&&void 0!==t?t:i,dynamicEnv:null!==(u=n.dynamicEnv)&&void 0!==u?u:f,flag:null!==(s=n.flag)&&void 0!==s?s:null,handler:null!==(c=n.handler)&&void 0!==c?c:v})}),o[a]=m}}catch(B){if(exports.isContinuation(B))throw e.debug("Suspend. Continuation: ",B),B;if(B instanceof C)throw e.debug("Suspend. ContinuablePomise: ",B),B;if(e.debug("Caught an exception. Exception: ",B),!v)throw B;var M=v.parent[v.index];g(M);var N=M[2][1];exports.setEnv(v.env,N,B),s.splice.apply(s,r([0,s.length],s.filter(function(n){return n.handler!==v}))),l(v)}finally{e.debug("Evaluation Done. Node, env, dynamicEnv: ",o[a],i,f)}};s.length;)f();return e.debug("Evaluatin finished. Result: ",i[0]),i[0]},this.eval=function(n){return e.evalAST(n)},this.rep=function(n){try{return JSON.stringify(e.eval(JSON.parse(n)))}catch(r){if(r instanceof TypeError&&r.message.match(/(circular|cyclic)/i))return;throw r}},this.resume=function(n,r){return e.evalAST(["resume",n,r])},this.evalInBase=function(n){e.evalAST(n,[e.base,null])},this.derefBOR=function(n){return exports.isBOR(e.base,n)?e.base[n.bor]:n},this.wrapLambda=function(n){return exports.isLambda(n)?function(){for(var t=[],o=0;o<arguments.length;o++)t[o]=arguments[o];return e.evalAST(r([["`",n]],t))}:n},this.evalAsync=function(n){return new Promise(function(r,t){!function n(o){try{r(o instanceof C?o.resume():e.eval(o))}catch(a){a instanceof C?a.then(function(){return n(a)},function(n){return t(n)}):t(a)}}(n)})},o(n),Object.assign(this,n),this.loadCore){var a=this.debugMode;this.debugMode=this.debugCore,this.evalInBase(require("./core.json")),this.debugMode=a}}}();exports.Interpreter=m;var E=function(n){var e=n.node,t=n.env,o=n.dynamicEnv,a=n.base,i=n.flag,u=n.interpreter,s=u.derefBOR(e[0]);if(!i&&!exports.isApplicable(s)){var f=r(e);return{ret:f,reevals:[{flag:"!"}],subevals:f.map(function(n,e){return{parent:f,index:e,env:t}})}}var c=e.slice(1);if(l(s))try{return{ret:s.apply(void 0,c.map(function(n){return u.wrapLambda(u.derefBOR(n))}))}}catch(d){if(exports.isContinuation(d))throw"Javascript function can not throw any continuation.";throw d}else{if(!exports.isLambda(s))throw String(s)+" is not applicable";var v=s[1],p=s[2],d=s[3];if("function"!=typeof p)return{ret:p,reevals:[{env:exports.newEnv(d,v,c)}]};try{return{ret:p(new j(exports.newEnv(d,v,c),o,t,a),u)}}catch(d){if(exports.isContinuation(d))throw"Javascript function can not throw any continuation.";throw d}}},w=function(n){var e=n.node,t=n.env,o=n.base,i=n.interpreter;a(e[0]);var u=i.derefBOR(exports.findEnv(t,o,e[0])[0]);return c(u),{ret:r([u[1]],e.slice(1)),reevals:[{flag:"!"},{flag:null}]}},A=function(n){var e=n.node,t=n.env,o=n.base,i=n.flag,u=n.interpreter;if(i){s=u.derefBOR(e[0]);return v(s),{ret:r([s[1]],e.slice(1)),reevals:[{flag:"!"},{flag:null}]}}a(e[0]);var s=u.derefBOR(exports.findEnv(t,o,e[0])[0]);v(s);var l=r(e);return{ret:l,subevals:l.map(function(n,e){return{parent:l,index:e}}),reevals:[{flag:"!"}]}},O=function(n){var e,t=n.node,o=n.flag,a=n.cont,i=t[0];if(o||exports.isApplicable(i)){var u=t.slice(1);d(i);var s=i.current,l=s.parent;l[s.index]=null!==(e=u[0])&&void 0!==e?e:null;var f=i.stack.length>0?i.stack[0].parent:l;if(1!==f.length)throw"Illeal root of continuation";var c=i.stack.map(function(n){return n.parent===f&&(n.parent=a.current.parent,n.index=a.current.index),n});return{ret:f[0],subevals:c.reverse()}}var v=r(t);return{ret:v,reevals:[{flag:"!"}],subevals:v.map(function(n,e){return{parent:v,index:e}})}},S={"`":function(n){return{ret:n.node[1]}},eval:function(n){var e=n.node;if(n.flag)return{ret:e[1],reevals:[{flag:null}]};var t=r(e);return{ret:t,reevals:[{flag:"!"}],subevals:[{parent:t,index:1}]}},def:function(n){var e=n.node,t=n.env;if(n.flag){var o=e[1],i=e[2],u=void 0===i?null:i;return a(o),{ret:exports.setEnv(t,o,u)}}var s=r(e);return{ret:s,reevals:[{flag:"!"}],subevals:[{parent:s,index:2}]}},defdynamic:function(n){var e=n.node,t=n.dynamicEnv;if(n.flag){var o=e[1],i=e[2],u=void 0===i?null:i;return a(o),exports.setEnv(y(t),o,u),{ret:u}}var s=r(e);return{ret:s,reevals:[{flag:"!"}],subevals:[{parent:s,index:2}]}},"~":function(n){var e=n.node,t=n.flag,o=r(e);return t?(f(o[1]),{ret:o}):{ret:o,reevals:[{flag:"!"}],subevals:[{parent:o,index:1}]}},"~~":function(n){var e=n.node,t=n.flag,o=r(e);return t?(f(o[1]),{ret:o}):{ret:o,reevals:[{flag:"!"}],subevals:[{parent:o,index:1}]}},".-":function(n){var e=n.node,t=(n.base,n.flag),o=n.interpreter;if(t){var a=o.derefBOR(e[1]);if(null==a)throw"Can't read/set property of null or undefined.";var u=e.map(function(n){return o.derefBOR(n)}),s=u[2],l=u[3];return i(s),{ret:3===e.length?a[s]:a[s]=l}}var f=r(e);return{ret:f,reevals:[{flag:"!"}],subevals:f.map(function(n,e){return e>=1&&{parent:f,index:e}})}},".":function(n){var e=n.node,t=(n.base,n.flag),o=n.interpreter;if(!t){var a=r(e);return{ret:a,reevals:[{flag:"!"}],subevals:a.map(function(n,e){return e>=1&&{parent:a,index:e}})}}var u=o.derefBOR(e[1]);if(null==u)throw"Can't call method of null or undefined.";var s=e[2],l=e.slice(3);if(i(s),"function"!=typeof u[s])return f(u[s]),{ret:r([u[s]],l),reevals:[{flag:"!"}]};try{return{ret:u[s].apply(u,l.map(function(n){return o.wrapLambda(o.derefBOR(n))}))}}catch(c){if(exports.isContinuation(c))throw"Javascript methods can not throw any continuation.";throw c}},oget:function(n){var e=n.node,t=(n.base,n.flag),o=n.interpreter;if(t){var a=o.derefBOR(e[1]);if(null==a)throw"Can't read property of null or undefined.";var u=e[2];return i(u),{ret:a[u]}}var s=r(e);return{ret:s,reevals:[{flag:"!"}],subevals:s.map(function(n,e){return e>=1&&{parent:s,index:e}})}},oset:function(n){var e=n.node,t=(n.base,n.flag),o=n.interpreter;if(t){var a=o.derefBOR(e[1]);if(null==a)throw"Can't set property of null or undefined.";var u=e[2],s=e[3];return i(u),{ret:a[u]=s}}var l=r(e);return{ret:l,reevals:[{flag:"!"}],subevals:l.map(function(n,e){return e>=1&&{parent:l,index:e}})}},try:function(n){var e=n.node,t=n.env,o=n.dynamicEnv,a=n.flag,i=n.cont,u=n.handler;if(g(e),a){if("!"===a)return{ret:e[1]};if("!!"===a)return{ret:e[2][2],reevals:[{}]};throw"Illegal status for try-catch."}var s={parent:i.current.parent,index:i.current.index,env:exports.newEnv(t,[],[]),dynamicEnv:o,flag:"!!",handler:u},l=r(e);return{ret:l,reevals:[{flag:"!",handler:s}],subevals:[{parent:l,index:1,handler:s}]}},fn:function(n){var e=n.node,r=n.env;return h(e),{ret:["=>",e[1],e[2],r]}},map:function(n){var e=n.node;if(n.flag){var t=e[1],o=e[2];s(o);var a=o.map(function(n,e){return[t,o[e]]});return{ret:a,subevals:a.map(function(n,e){return{parent:a,index:e,flag:"!"}})}}var i=r(e);return{ret:i,reevals:[{flag:"!"}],subevals:i.map(function(n,e){return e>=1&&{parent:i,index:e}})}},apply:function(n){var e=n.node;if(n.flag){var t=e[1],o=e.slice(2),a=o.pop();return s(a),o.push.apply(o,a),{ret:r([t],o),reevals:[{flag:"!"}]}}var i=r(e);return{ret:i,reevals:[{flag:"!"}],subevals:i.map(function(n,e){return e>=1&&{parent:i,index:e}})}},let:function(n){var e=n.node,t=n.env;x(e);var o=e[1],a=e[2];o.length%2==1&&o.push(null);var i=o.reduce(function(n,e,r){return r%2?n:n.concat([[o[r],o[r+1]]])},[]);return{ret:r(["do"],i.map(function(n){return["def",n[0],n[1]]}),[a]),reevals:[{env:exports.newEnv(t,[],[])}]}},"dynamic-let":function(n){var e=n.node,t=n.dynamicEnv,o=n.flag;if(b(e),o){var a=e[1];f=e[2];a.length%2==1&&a.push(null);var i=a.reduce(function(n,e,r){return r%2?n:n.concat([[a[r],a[r+1]]])},[]),u=exports.newEnv(t,[],[]);return i.forEach(function(n){var e=n[0],r=n[1];return exports.setEnv(u,String(e),r)}),{ret:f,reevals:[{dynamicEnv:u}]}}var s=e[0],l=e[1],f=e[2],c=r(l);return{ret:[s,c,f],subevals:c.map(function(n,e){return e}).filter(function(n){return n%2==1}).map(function(n){return{parent:c,index:n}}),reevals:[{flag:"!"}]}},do:function(n){var e=n.node.slice(1),r=e.slice(-1)[0];return{ret:void 0===r?null:r,reevals:[{flag:null}],subevals:e.slice(0,-1).map(function(n){return{parent:[n],index:0}})}},if:function(n){var e=n.node;if(n.flag)return{ret:e[1]?e[2]:e[3],reevals:[{flag:null}]};var t=r(e);return{ret:t,reevals:[{flag:"!"}],subevals:[{parent:t,index:1}]}},suspend:function(n){var e,t=n.node,o=n.flag,a=n.cont;if(o){var i=t.slice(1);throw a.info=null!==(e=i[0])&&void 0!==e?e:null,a}var u=r(t);return{ret:u,reevals:[{flag:"!"}],subevals:[{parent:u,index:1}]}},resume:function(n){var e=n.node,t=(n.flag,e[1]),o=e.slice(2);return d(t),{ret:r([t],o),reevals:[{flag:"!"}]}},dynamic:function(n){var e=n.node,r=n.dynamicEnv,o=e[1];a(o);var i=exports.findEnv(r,null,o),u=i[0];return{ret:i[1]?u:t("dynamic variable "+o+" not found")}},await:function(n){var e=n.node,t=n.flag,o=n.cont,a=n.interpreter;if(t){var i=e.slice(1);throw new C(a,0===i.length?null:1===i.length?i[0]:Promise.all(i),o)}var u=r(e);return{ret:u,reevals:[{flag:"!"}],subevals:[{parent:u,index:1}]}}},j=function(){return function(n,e,r,t){var o=this;this.get=function(n){return exports.findEnv(o.env,o.base,n)[0]},this.has=function(n){return exports.findEnv(o.env,o.base,n)[1]},this.set=function(n,e){return exports.setEnv(o.env,n,e)},this.dynamicGet=function(n){return exports.findEnv(o.dynamicEnv,null,n)[0]},this.dynamicHas=function(n){return exports.findEnv(o.dynamicEnv,null,n)[1]},this.dynamicSet=function(n,e){return exports.setEnv(y(o.dynamicEnv),n,e)},this.dynamicSetLocal=function(n,e){return exports.setEnv(o.dynamicEnv,n,e)},this.callerGet=function(n){return exports.findEnv(o.callerEnv,o.base,n)[0]},this.callerHas=function(n){return exports.findEnv(o.callerEnv,o.base,n)[1]},this.env=n,this.dynamicEnv=e,this.callerEnv=r,this.base=t}}();exports.EnvWrapper=j;var C=function(){function n(n,e,r){var t=this;this.status="pending",this.promise=new Promise(function(n,e){t.resolve=n,t.reject=e}),this.interpreter=n,this.coninuation=r,exports.isPromiseLike(e)?e.then(function(n){t.resolvedValue=n,t.status="fulfilled",t.resolve()},function(n){t.rejectedReason=n,t.status="rejected",t.reject(n)}):(this.resolvedValue=e,this.status="fulfilled",this.resolve())}return n.prototype.isFulfilled=function(){return"fulfilled"===this.status},n.prototype.isRejected=function(){return"rejected"===this.status},n.prototype.isPending=function(){return"pending"===this.status},n.prototype.reason=function(){if(!this.isRejected())throw new Error("The promise is not rejected yet.");return this.rejectedReason},n.prototype.resume=function(){if(!this.isFulfilled())throw new Error("The promise is not fulfilled yet.");return this.interpreter.resume(this.coninuation,this.resolvedValue)},n.prototype.then=function(n,e){return this.promise.then(n,e)},n.prototype.catch=function(n){return this.promise.catch(n)},n}();exports.ContinuablePromise=C,exports.TheGlobal=globalThis||window||n||this;var R=Object.assign(Object.create(exports.TheGlobal),{"=":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return n[0]===n[1]},"<":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return Number(n[0])<Number(n[1])},"+":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return Number(n[0])+Number(n[1])},"-":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return Number(n[0])-Number(n[1])},"*":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return Number(n[0])*Number(n[1])},"/":function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return Number(n[0])/Number(n[1])},isa:function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return n[0]instanceof n[1]},type:function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return e(n[0])},new:function(){for(var n,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return new((n=e[0]).bind.apply(n,e))},del:function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return delete n[0][n[1]]},throw:function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];throw n[0]},read:function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];return JSON.parse(n[0])},js:eval});exports.default=m;
},{"./core.json":"Oxyk"}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,t,r,i){void 0===i&&(i=r),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,i){void 0===i&&(i=r),e[i]=t[r]}),t=this&&this.__exportStar||function(t,r){for(var i in t)"default"===i||r.hasOwnProperty(i)||e(r,t,i)};Object.defineProperty(exports,"__esModule",{value:!0}),t(require("./interpreter"),exports);
},{"./interpreter":"Tbsw"}]},{},["QCba"], null)
//# sourceMappingURL=/index.js.map