/*!
  ContinuableMinimalLisp.js v0.4.4
  https://github.com/trb-a/continuable-minimal-lisp
  Released under the MIT License.
  Note: Language specification's license is unconfirmed.
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var Core = [
	"do",
	[
		"def",
		"new",
		[
			"fn",
			[
				"a",
				"&",
				"b"
			],
			[
				".",
				"Reflect",
				[
					"`",
					"construct"
				],
				"a",
				"b"
			]
		]
	],
	[
		"def",
		"del",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				".",
				"Reflect",
				[
					"`",
					"deleteProperty"
				],
				"a",
				"b"
			]
		]
	],
	[
		"def",
		"list",
		[
			"fn",
			[
				"&",
				"a"
			],
			"a"
		]
	],
	[
		"def",
		">=",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				"if",
				[
					"<",
					"a",
					"b"
				],
				false,
				true
			]
		]
	],
	[
		"def",
		">",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				"if",
				[
					">=",
					"a",
					"b"
				],
				[
					"if",
					[
						"=",
						"a",
						"b"
					],
					false,
					true
				],
				false
			]
		]
	],
	[
		"def",
		"<=",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				"if",
				[
					">",
					"a",
					"b"
				],
				false,
				true
			]
		]
	],
	[
		"def",
		"classOf",
		[
			"fn",
			[
				"a"
			],
			[
				".",
				[
					".-",
					[
						".-",
						"Object",
						[
							"`",
							"prototype"
						]
					],
					[
						"`",
						"toString"
					]
				],
				[
					"`",
					"call"
				],
				"a"
			]
		]
	],
	[
		"def",
		"not",
		[
			"fn",
			[
				"a"
			],
			[
				"if",
				"a",
				false,
				true
			]
		]
	],
	[
		"def",
		"null?",
		[
			"fn",
			[
				"a"
			],
			[
				"=",
				null,
				"a"
			]
		]
	],
	[
		"def",
		"true?",
		[
			"fn",
			[
				"a"
			],
			[
				"=",
				true,
				"a"
			]
		]
	],
	[
		"def",
		"false?",
		[
			"fn",
			[
				"a"
			],
			[
				"=",
				false,
				"a"
			]
		]
	],
	[
		"def",
		"string?",
		[
			"fn",
			[
				"a"
			],
			[
				"if",
				[
					"=",
					"a",
					null
				],
				false,
				[
					"=",
					[
						"`",
						"String"
					],
					[
						".-",
						[
							".-",
							"a",
							[
								"`",
								"constructor"
							]
						],
						[
							"`",
							"name"
						]
					]
				]
			]
		]
	],
	[
		"def",
		"pr-str",
		[
			"fn",
			[
				"&",
				"a"
			],
			[
				".",
				[
					"map",
					[
						".-",
						"JSON",
						[
							"`",
							"stringify"
						]
					],
					"a"
				],
				[
					"`",
					"join"
				],
				[
					"`",
					" "
				]
			]
		]
	],
	[
		"def",
		"str",
		[
			"fn",
			[
				"&",
				"a"
			],
			[
				".",
				[
					"map",
					[
						"fn",
						[
							"x"
						],
						[
							"if",
							[
								"string?",
								"x"
							],
							"x",
							[
								".",
								"JSON",
								[
									"`",
									"stringify"
								],
								"x"
							]
						]
					],
					"a"
				],
				[
					"`",
					"join"
				],
				[
					"`",
					""
				]
			]
		]
	],
	[
		"def",
		"prn",
		[
			"fn",
			[
				"&",
				"a"
			],
			[
				"do",
				[
					".",
					"console",
					[
						"`",
						"log"
					],
					[
						".",
						[
							"map",
							[
								".-",
								"JSON",
								[
									"`",
									"stringify"
								]
							],
							"a"
						],
						[
							"`",
							"join"
						],
						[
							"`",
							" "
						]
					]
				],
				null
			]
		]
	],
	[
		"def",
		"println",
		[
			"fn",
			[
				"&",
				"a"
			],
			[
				"do",
				[
					".",
					"console",
					[
						"`",
						"log"
					],
					[
						".",
						[
							"map",
							[
								"fn",
								[
									"x"
								],
								[
									"if",
									[
										"string?",
										"x"
									],
									"x",
									[
										".",
										"JSON",
										[
											"`",
											"stringify"
										],
										"x"
									]
								]
							],
							"a"
						],
						[
							"`",
							"join"
						],
						[
							"`",
							" "
						]
					]
				],
				null
			]
		]
	],
	[
		"def",
		"list?",
		[
			"fn",
			[
				"a"
			],
			[
				".",
				"Array",
				[
					"`",
					"isArray"
				],
				"a"
			]
		]
	],
	[
		"def",
		"contains?",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				".",
				"a",
				[
					"`",
					"hasOwnProperty"
				],
				"b"
			]
		]
	],
	[
		"def",
		"get",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				"if",
				[
					"contains?",
					"a",
					"b"
				],
				[
					".-",
					"a",
					"b"
				],
				null
			]
		]
	],
	[
		"def",
		"set",
		[
			"fn",
			[
				"a",
				"b",
				"c"
			],
			[
				"do",
				[
					".-",
					"a",
					"b",
					"c"
				],
				"a"
			]
		]
	],
	[
		"def",
		"keys",
		[
			"fn",
			[
				"a"
			],
			[
				".",
				"Object",
				[
					"`",
					"keys"
				],
				"a"
			]
		]
	],
	[
		"def",
		"vals",
		[
			"fn",
			[
				"a"
			],
			[
				".",
				"Object",
				[
					"`",
					"values"
				],
				"a"
			]
		]
	],
	[
		"def",
		"cons",
		[
			"fn",
			[
				"a",
				"b"
			],
			[
				".",
				[
					"`",
					[
					]
				],
				[
					"`",
					"concat"
				],
				[
					"list",
					"a"
				],
				"b"
			]
		]
	],
	[
		"def",
		"concat",
		[
			"fn",
			[
				"&",
				"a"
			],
			[
				".",
				[
					".-",
					[
						"list"
					],
					[
						"`",
						"concat"
					]
				],
				[
					"`",
					"apply"
				],
				[
					"list"
				],
				"a"
			]
		]
	],
	[
		"def",
		"nth",
		"get"
	],
	[
		"def",
		"first",
		[
			"fn",
			[
				"a"
			],
			[
				"if",
				[
					">",
					[
						".-",
						"a",
						[
							"`",
							"length"
						]
					],
					0
				],
				[
					"nth",
					"a",
					0
				],
				null
			]
		]
	],
	[
		"def",
		"last",
		[
			"fn",
			[
				"a"
			],
			[
				"nth",
				"a",
				[
					"-",
					[
						".-",
						"a",
						[
							"`",
							"length"
						]
					],
					1
				]
			]
		]
	],
	[
		"def",
		"count",
		[
			"fn",
			[
				"a"
			],
			[
				".-",
				"a",
				[
					"`",
					"length"
				]
			]
		]
	],
	[
		"def",
		"empty?",
		[
			"fn",
			[
				"a"
			],
			[
				"if",
				[
					"list?",
					"a"
				],
				[
					"=",
					0,
					[
						".-",
						"a",
						[
							"`",
							"length"
						]
					]
				],
				[
					"=",
					"a",
					null
				]
			]
		]
	],
	[
		"def",
		"slice",
		[
			"fn",
			[
				"a",
				"b",
				"&",
				"end"
			],
			[
				".",
				"a",
				[
					"`",
					"slice"
				],
				"b",
				[
					"if",
					[
						">",
						[
							".-",
							"end",
							[
								"`",
								"length"
							]
						],
						0
					],
					[
						"get",
						"end",
						0
					],
					[
						".-",
						"a",
						[
							"`",
							"length"
						]
					]
				]
			]
		]
	],
	[
		"def",
		"rest",
		[
			"fn",
			[
				"a"
			],
			[
				"slice",
				"a",
				1
			]
		]
	],
	[
		"def",
		"and",
		[
			"~",
			[
				"fn",
				[
					"&",
					"xs"
				],
				[
					"if",
					[
						"empty?",
						"xs"
					],
					true,
					[
						"if",
						[
							"=",
							1,
							[
								".-",
								"xs",
								[
									"`",
									"length"
								]
							]
						],
						[
							"first",
							"xs"
						],
						[
							"list",
							[
								"`",
								"let"
							],
							[
								"list",
								[
									"`",
									"__and"
								],
								[
									"first",
									"xs"
								]
							],
							[
								"list",
								[
									"`",
									"if"
								],
								[
									"`",
									"__and"
								],
								[
									"concat",
									[
										"`",
										[
											"and"
										]
									],
									[
										"rest",
										"xs"
									]
								],
								[
									"`",
									"__and"
								]
							]
						]
					]
				]
			]
		]
	],
	[
		"def",
		"or",
		[
			"~",
			[
				"fn",
				[
					"&",
					"xs"
				],
				[
					"if",
					[
						"empty?",
						"xs"
					],
					null,
					[
						"if",
						[
							"=",
							1,
							[
								".-",
								"xs",
								[
									"`",
									"length"
								]
							]
						],
						[
							"first",
							"xs"
						],
						[
							"list",
							[
								"`",
								"let"
							],
							[
								"list",
								[
									"`",
									"__or"
								],
								[
									"first",
									"xs"
								]
							],
							[
								"list",
								[
									"`",
									"if"
								],
								[
									"`",
									"__or"
								],
								[
									"`",
									"__or"
								],
								[
									"concat",
									[
										"`",
										[
											"or"
										]
									],
									[
										"rest",
										"xs"
									]
								]
							]
						]
					]
				]
			]
		]
	],
	null
];

// -------------------------------------------------------
//                       Consant
// -------------------------------------------------------
var LANGUAGE = "Continuable-miniMAL-Lisp";
var VERSION = "0.4.4";
// -------------------------------------------------------
//                   Utilities
// -------------------------------------------------------
// Creates a deep clone of given AST recursively.
// Arrays and simple objects are cloned. Instances of classes are not.
var cloneAST = function (ast, map) {
    if (map === void 0) { map = new Map(); }
    if (map.has(ast)) {
        return map.get(ast);
    }
    else if (typeof ast === "object" && ast !== null && ast.constructor === Object) {
        return Object.keys(ast).reduce(function (acc, key) {
            acc[key] = cloneAST(ast[key], map);
            return acc;
        }, {});
    }
    else if (ast instanceof Array) {
        var arr = map.set(ast, []).get(ast);
        arr.push.apply(arr, ast.map(function (a) { return cloneAST(a, map); }));
        return arr;
    }
    else {
        return ast;
    }
};
// Throws string.
// Note: Javascript's stacktrace is meaningless for lisp errors.
// IMPROVEME: implement lisp stacktrace.
var error = function (str) {
    throw str;
};
// Delete all the keys with undefined value in a object.
var deleteUndefined = function (obj) {
    if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).filter(function (k) { return obj[k] === undefined; }).forEach(function (k) { return delete obj[k]; });
    }
};
var isPromiseLike = function (obj) {
    return !!obj && (typeof obj === "object" || typeof obj === "function") &&
        typeof obj.then === "function";
};
// -------------------------------------------------------
//               Type guards / asserts
// -------------------------------------------------------
// Asserts x is string. Use this before setEnv or findEnv.
var assertSymbol = function (x) {
    return (typeof x === "string") || error(x + " is not a symbol");
};
// Asserts x is string or number or symbol.
var assertPropertyIndex = function (x) { return (typeof x === "string" || typeof x === "symbol" ||
    typeof x === "number" || error("String(x) is not a property index")); };
// Asserts x is BOR.
// Strict check so that we don't take user's object as BOR as far as possible.
// Note: We recommend to use Map instead of object for dictionary, if serializer accept Map.
var isBOR = function (base, x) {
    return typeof x === "object" && x !== null && typeof x["bor"] === "string" &&
        x.constructor === Object && Object.keys(x).length === 1 && x["bor"] in base;
};
// Determines if x is AST[].
var isList = function (x) { return (x instanceof Array); };
// Asserts x is AST[].
var assertList = function (x) {
    return isList(x) || error(x + " is not an array");
};
// Determines if x is Env.
// Note: we don't get deep into parents, that's heavy & too much.
var isEnv = function (x) {
    return x instanceof Array &&
        typeof x[0] === "object" && x[0] !== null &&
        (x[1] instanceof Array || x[1] === null);
}; // can be !x[1] || isEnv(x[1])
// Determines if x is a lambda ( Lisp labmda or JS lambda)
var isLambda = function (x) {
    return x instanceof Array && x[0] === "=>" && x.length === 4 && isEnv(x[3]) && ((x[1] instanceof Array && x[1].every(function (a) { return typeof a === "string"; })));
};
var isMacro = function (x) {
    return x instanceof Array && x[0] === "~" && x.length === 2
        && isApplicable(x[1]);
};
var isHalfMacro = function (x) {
    return x instanceof Array && x[0] === "~~" && x.length === 2
        && isApplicable(x[1]);
};
// Determines if x is a JSFunction
var isJSFunction = function (x) {
    return typeof x === "function";
};
// Determines if x is a lambda, js function or continuation.
var isApplicable = function (x) {
    return isLambda(x) || isJSFunction(x) || isContinuation(x) || isMacro(x) || isHalfMacro(x);
};
// Asserts if x is a lambda, js function or continuation.
var assertApplicable = function (x) {
    return isApplicable(x) || error(x + " is not a applicable");
};
var assertMacro = function (x) {
    return isMacro(x) || error(x + " is not a macro");
};
var assertHalfMacro = function (x) {
    return isHalfMacro(x) || error(x + " is not a half macro");
};
// const assertJSFunction: (x: any) => asserts x is JSFunction = (x) =>
//   typeof x === "function" || error(`${x} is not a JS function`);
// Determines if x is evaluation request.
var isEval = function (x) {
    return typeof x === "object" && x !== null &&
        x["parent"] instanceof Array &&
        typeof x["index"] === "number" &&
        isEnv(x["env"]) &&
        (x["flag"] === null || typeof x["flag"] === "string") &&
        typeof x["handler"] === "object";
}; // Note: null | object. We don't get in deep.
// Determines if x is continuation (suspended runtime state)
// Note: Not cheking everything, but just surface.
// Checks format version at the same time.
var isContinuation = function (x) {
    return typeof x === "object" && x !== null &&
        isEval(x["current"]) &&
        x["stack"] instanceof Array &&
        typeof x["version"] === "string" &&
        x["version"].replace(/\.[^.]+$/, "") === VERSION.replace(/\.[^.]+$/, "");
};
// Asserts if x is continuation (suspended runtime state)
var assertContinuation = function (x) {
    return isContinuation(x) || error(x + " is not a continuation");
};
// Assert x is "fn" form
var assertFn = function (x) { return (x instanceof Array && x[0] === "fn" && x.length === 3 &&
    x[1] instanceof Array && x[1].every(function (a) { return typeof a === "string"; })) || error(x + " is not a fn form or malformed"); };
// Assert x is "try" form
var assertTry = function (x) { return (x instanceof Array && x[0] === "try" &&
    x[2] instanceof Array && typeof x[2][1] === "string" && x[2].length >= 3) || error(x + " is not a try form or malformed"); };
// Assert x is "let" form
var assertLet = function (x) { return (x instanceof Array && x[0] === "let" &&
    x[1] instanceof Array && x.length >= 3) || error(x + " is not a let form or malformed"); };
// Assert x is "dynamic-let" form
var assertDynamicLet = function (x) { return (x instanceof Array && x[0] === "dynamic-let" &&
    x[1] instanceof Array && x.length >= 3) || error(x + " is not a let form or malformed"); };
// -------------------------------------------------------
//  Create, set data to, and get data from the environment.
// -------------------------------------------------------
// Return new Env with symbols in ast bound to
// corresponding values. "variadic" option allows
// clojure style variadic parameters.
var newEnv = function (upper, symbols, values, variadic) {
    if (variadic === void 0) { variadic = true; }
    var bounds = {};
    for (var i = 0; i < symbols.length; i++) {
        if (variadic && symbols[i] === "&") {
            bounds["" + symbols[i + 1]] = values.slice(i);
            break;
        }
        else {
            bounds["" + symbols[i]] = values[i];
        }
    }
    return [bounds, upper];
};
// bind a value with a symbol in the environment.
var setEnv = function (env, symbol, value) {
    return (env[0]["" + symbol] = value);
};
// get value and whether existance of the symbol from environment or Base.
// returns: [<found value or null>, <found or not>, <BOR or not>]
var findEnv = function (env, base, symbol) {
    for (var e = env; !!e; e = e[1]) {
        if (e[0].hasOwnProperty(symbol)) {
            return [e[0][symbol], true, false];
        }
        else if (!e[1] && base && symbol in base && base[symbol] !== null &&
            (typeof base[symbol] === "object" || typeof base[symbol] === "function")) {
            var bor = { bor: symbol }; // Create BOR here.
            return [bor, true, true];
        }
    }
    return [null, false, false];
};
// Get root of env (except base)
var getEnvRoot = function (e) { return e[1] ? getEnvRoot(e[1]) : e; };
// -------------------------------------------------------
//               Interpreter class
// -------------------------------------------------------
var Interpreter = /** @class */ (function () {
    // Constructor can take options.
    // Load core.json to the Base object unless disabled.
    function Interpreter(options) {
        var _this = this;
        this.stackMax = Infinity; // Stack size. Throws error when exceeds.
        /* eslint-disable-next-line no-use-before-define */
        this.base = DEFAULT_BASE; // upper of root environment.
        this.env = [{}, null]; // environment root (except base).
        this.dynamicEnv = [{}, null]; // dynamic environment root
        this.loadCore = true; // load core on construct or not.
        // for debugging
        this.debugCount = 0; // Counts how may times debug message shown.
        this.debugMode = false; // Show debug messsage if true.except loading core.
        this.debugCore = false; // Show debug messsage if true on loading core.
        this.debugMax = Infinity; // Throws error if debugCount exceeds this.
        this.debugFilter = function () { return true; };
        // Show debug message on console.
        this.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!_this.debugMode || !_this.debugFilter(message)) {
                return;
            }
            args = args.map(function (a) { return a instanceof Array ? cloneAST(a) : a; });
            console.log.apply(console, __spreadArrays([message], args));
            _this.debugCount++;
            if (_this.debugCount > _this.debugMax) {
                throw new Error("too many debug message!");
            }
        };
        // Evaluates the given AST and retuns the result.
        this.evalAST = function (ast, env, dynamicEnv) {
            if (env === void 0) { env = _this.env; }
            if (dynamicEnv === void 0) { dynamicEnv = _this.dynamicEnv; }
            // Root container contains the given AST.
            // This enables replacement of the value even for scalar value.
            var root = [ast];
            // Evaluation stack contains evaluation requests with environment.
            // The initial value includes the root container above.
            var stack = [{ parent: root, index: 0, env: env, dynamicEnv: dynamicEnv, flag: null, handler: null }];
            // A utility function the push evaluation requests on the stack.
            // The evaluation will be done in the given order.
            // Throws an exception if the given items + stacked items exceeds QUEUE_MAX.
            var pushEvalStack = function (ev) { return (stack.length >= _this.stackMax)
                ? error("Stack overflow") : (stack.push(ev), ev); };
            var _loop_1 = function () {
                _this.debug("Current eval-stack length, eval-stack: ", stack.length, stack);
                var current = stack.pop();
                var parent_1 = current.parent, index = current.index, env_1 = current.env, dynamicEnv_1 = current.dynamicEnv, flag = current.flag, handler = current.handler;
                var node = parent_1[index];
                _this.debug("Next evaluating AST node, env, dynamicEnv, flag: ", node, env_1, dynamicEnv_1, flag);
                try {
                    if (typeof node === "string") {
                        // Symbol - Look up it from the environment.
                        var _a = findEnv(env_1, _this.base, node), v = _a[0], found = _a[1];
                        parent_1[index] = found ? v : error(node + " not found");
                    }
                    else if (isList(node)) {
                        // Form - Apply it.
                        // Select form handler.
                        // If the car is symbol, get the value from the environment
                        // to determine if this is a macro / half macro form or coninuation form.
                        var envv = (typeof node[0] === "string") ? _this.derefBOR(findEnv(env_1, _this.base, node[0])[0]) : null;
                        var formHandler = isMacro(envv) ? (MacroHandler) : (isHalfMacro(envv) || (isHalfMacro(_this.derefBOR(node[0])) && !!flag)) ? (HalfMacroHandler) : (typeof node[0] === "string" && SpecialFormHandlers.hasOwnProperty(node[0])) ? (SpecialFormHandlers[node[0]]) : (isContinuation(node[0]) || isContinuation(envv)) ? (ContinuationFormHandler) : StandardFormHandler;
                        // Apply the selected form handler.
                        var _b = formHandler({
                            node: node, env: env_1,
                            base: _this.base,
                            dynamicEnv: dynamicEnv_1, flag: flag, handler: handler,
                            cont: { current: current, stack: stack, lang: LANGUAGE, version: VERSION, info: null },
                            interpreter: _this,
                        }), ret = _b.ret, subevals = _b.subevals, reevals = _b.reevals;
                        // Push on evaluattion stack and substitute the AST according to the return values.
                        reevals === null || reevals === void 0 ? void 0 : reevals.reverse().forEach(function (ev) {
                            var _a, _b, _c, _d, _e, _f;
                            return pushEvalStack({
                                parent: (_a = ev.parent) !== null && _a !== void 0 ? _a : parent_1,
                                index: (_b = ev.index) !== null && _b !== void 0 ? _b : index,
                                env: (_c = ev.env) !== null && _c !== void 0 ? _c : env_1,
                                dynamicEnv: (_d = ev.dynamicEnv) !== null && _d !== void 0 ? _d : dynamicEnv_1,
                                flag: (_e = ev.flag) !== null && _e !== void 0 ? _e : null,
                                handler: (_f = ev.handler) !== null && _f !== void 0 ? _f : handler
                            });
                        });
                        subevals === null || subevals === void 0 ? void 0 : subevals.reverse().forEach(function (ev) {
                            var _a, _b, _c, _d, _e, _f;
                            return ev && pushEvalStack({
                                parent: (_a = ev.parent) !== null && _a !== void 0 ? _a : parent_1,
                                index: (_b = ev.index) !== null && _b !== void 0 ? _b : index,
                                env: (_c = ev.env) !== null && _c !== void 0 ? _c : env_1,
                                dynamicEnv: (_d = ev.dynamicEnv) !== null && _d !== void 0 ? _d : dynamicEnv_1,
                                flag: (_e = ev.flag) !== null && _e !== void 0 ? _e : null,
                                handler: (_f = ev.handler) !== null && _f !== void 0 ? _f : handler
                            });
                        });
                        parent_1[index] = ret;
                    }
                    else {
                        // Not a symbol or form - Evaluated as is. Don't change the AST.
                    }
                }
                catch (e) {
                    if (isContinuation(e)) {
                        // Thrown continuation does not be caught by try-catch.
                        _this.debug("Suspend. Continuation: ", e);
                        throw e;
                    }
                    else if (e instanceof ContinuablePromise) {
                        // Thrown ContinuablePromise does not be caught by try-catch too.
                        _this.debug("Suspend. ContinuablePomise: ", e);
                        throw e;
                    }
                    else {
                        // Exception.
                        _this.debug("Caught an exception. Exception: ", e);
                        if (handler) {
                            // Set the exception to the catch clause's environment.
                            var tryNode = handler.parent[handler.index];
                            assertTry(tryNode);
                            var _c = tryNode[2], param = _c[1];
                            setEnv(handler.env, param, e);
                            // Remove evaluation requests in try-clause, which have this error handler.
                            stack.splice.apply(stack, __spreadArrays([0, stack.length], stack.filter(function (ev) { return ev.handler !== handler; })));
                            // Request to evaluate catch-clause.
                            pushEvalStack(handler);
                        }
                        else {
                            // No error handler.
                            throw e;
                        }
                    }
                }
                finally {
                    _this.debug("Evaluation Done. Node, env, dynamicEnv: ", parent_1[index], env_1, dynamicEnv_1);
                }
            };
            // Continue evaluation until the stack becomes empty.
            while (stack.length) {
                _loop_1();
            }
            // Return the evaluated value in the container at last.
            _this.debug("Evaluatin finished. Result: ", root[0]);
            return root[0];
        };
        // Evaluate AST ( as public method )
        this.eval = function (ast) {
            return _this.evalAST(ast);
        };
        // Evaluate JSON & result as JSON using JSON.parse & JSON.stringify.
        // JSON.parse/stringify may throw exception.
        // If JSON.stringify trows an circular/cyclic structure error, returns undefined
        // instead of throwing exception.
        this.rep = function (input) {
            try {
                return JSON.stringify(_this.eval(JSON.parse(input)));
            }
            catch (e) {
                if (e instanceof TypeError && e.message.match(/(circular|cyclic)/i)) {
                    return undefined; // returns undefined if the value contains functions anyway.
                }
                throw e;
            }
        };
        // Resume with a continuation and parameter.
        // Note: parameter can be null.
        this.resume = function (cont, value) {
            return _this.evalAST(["resume", cont, value]);
        };
        // Evaluate AST with Base environment.
        // Base environment will not be included in continuation data.
        // Used for loading core.json.
        this.evalInBase = function (ast) {
            _this.evalAST(ast, [_this.base, null]);
        };
        // Dereference if the given argument is a BOR.
        this.derefBOR = function (ast) { return isBOR(_this.base, ast) ? _this.base[ast.bor] : ast; };
        // Wrap given lambda with JS function.
        // Internally used when calling JS function.
        this.wrapLambda = function (ast) { return isLambda(ast)
            ? function () {
                var a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    a[_i] = arguments[_i];
                }
                return _this.evalAST(__spreadArrays([["`", ast]], a));
            }
            : ast; };
        // This method can treat ["await", <a Promise/PromiseLike>] as if Javascript's "await"
        // function. Returns a Promise(or a PromiseLike) that resolves with the final
        // evaluated value of the given expression.
        this.evalAsync = function (expr) {
            return new Promise(function (resolve, reject) {
                // evaluates expr or Continuous promise recursively.
                // Note: promise must be fulfilled when calling func().
                var func = function (exprOrPromise) {
                    try {
                        if (exprOrPromise instanceof ContinuablePromise) {
                            resolve(exprOrPromise.resume());
                        }
                        else {
                            resolve(_this.eval(exprOrPromise));
                        }
                    }
                    catch (e) {
                        if (e instanceof ContinuablePromise) {
                            e.then(function () { return func(e); }, function (err) { return reject(err); });
                        }
                        else {
                            reject(e);
                        }
                    }
                };
                // Call the func above.
                func(expr);
            });
        };
        deleteUndefined(options); // Don't give any undefined value to the options.
        Object.assign(this, options);
        if (this.loadCore) {
            var debugMode = this.debugMode;
            this.debugMode = this.debugCore;
            this.evalInBase(Core);
            this.debugMode = debugMode;
        }
    }
    return Interpreter;
}());
// -------------------------------------------------------
//                Form handlers
// -------------------------------------------------------
// Standard form
var StandardFormHandler = function (_a) {
    var node = _a.node, env = _a.env, dynamicEnv = _a.dynamicEnv, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
    var f = interpreter.derefBOR(node[0]);
    if (!flag && !isApplicable(f)) {
        var cn_1 = __spreadArrays(node);
        return {
            ret: cn_1,
            reevals: [{ flag: "!" }],
            subevals: cn_1.map(function (v, index) { return ({ parent: cn_1, index: index, env: env }); }),
        };
    }
    else {
        var args = node.slice(1);
        // Apply function.
        if (isJSFunction(f)) {
            try {
                return { ret: f.apply(void 0, args.map(function (a) { return interpreter.wrapLambda(interpreter.derefBOR(a)); })) };
            }
            catch (e) {
                if (isContinuation(e)) {
                    throw "Javascript function can not throw any continuation.";
                }
                throw e;
            }
        }
        else if (isLambda(f)) {
            var params = f[1], body = f[2], e = f[3];
            if (typeof body === "function") {
                // JS lambda.
                // Note: Unlike JS functions, JS lambda receive arguments via environemnt.
                try {
                    var jsLambdaFunc = body;
                    return { ret: jsLambdaFunc(new EnvWrapper(newEnv(e, params, args), dynamicEnv, env, base), interpreter) };
                }
                catch (e) {
                    if (isContinuation(e)) {
                        throw "Javascript function can not throw any continuation.";
                    }
                    throw e;
                }
            }
            else {
                // Lisp lambda. create a new environment with arguments mapped to parameters
                // then evaluate the body.
                return { ret: body, reevals: [{ env: newEnv(e, params, args) }] };
            }
        }
        else {
            throw String(f) + " is not applicable";
        }
    }
};
// Macro form
// Note: Differences macros and non-special functions are
//   1. Macros don't evaluate the arguments.
//   2. Macros request re-evaluation of the results.
//   3. Macros can be applied only by symbols.
//   4. (Undocumented feature): can wrap special functions like fn/def/etc
var MacroHandler = function (_a) {
    var node = _a.node, env = _a.env, base = _a.base, interpreter = _a.interpreter;
    assertSymbol(node[0]);
    var v = interpreter.derefBOR(findEnv(env, base, node[0])[0]);
    assertMacro(v);
    // Apply the applicable and re-evaluate after that ( = 2 reevals )
    return { ret: __spreadArrays([v[1]], node.slice(1)), reevals: [{ flag: "!" }, { flag: null }] };
};
// Half macro form
// Half macros are like macros, but auguments are evaluated before applying macro function.
var HalfMacroHandler = function (_a) {
    var node = _a.node, env = _a.env, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
    if (!flag) {
        // Request subevaluation.
        // Note: we must keep BOR while subevaluation.
        assertSymbol(node[0]);
        var v = interpreter.derefBOR(findEnv(env, base, node[0])[0]);
        assertHalfMacro(v);
        var cn_2 = __spreadArrays(node);
        return {
            ret: cn_2,
            subevals: cn_2.map(function (v, index) { return ({ parent: cn_2, index: index }); }),
            reevals: [{ flag: "!" }]
        };
    }
    else {
        // Apply the applicable and re-evaluate after that ( = 2 reevals )
        var v = interpreter.derefBOR(node[0]);
        assertHalfMacro(v);
        return { ret: __spreadArrays([v[1]], node.slice(1)), reevals: [{ flag: "!" }, { flag: null }] };
    }
};
// Continuation form
var ContinuationFormHandler = function (_a) {
    var _b;
    var node = _a.node, flag = _a.flag, cont = _a.cont;
    var f = node[0];
    if (!flag && !isApplicable(f)) {
        // Evaluate the argument. (In the current environment, Not in the continuation's one)
        var cn_3 = __spreadArrays(node);
        return {
            ret: cn_3,
            reevals: [{ flag: "!" }],
            subevals: cn_3.map(function (v, index) { return ({ parent: cn_3, index: index }); }),
        };
    }
    else {
        // Mount the continuation on the current AST, stack, and handlers.
        var args = node.slice(1);
        assertContinuation(f);
        // Pass the given argument to the suspender.
        var _c = f.current, cparent = _c.parent, cindex = _c.index;
        cparent[cindex] = (_b = args[0]) !== null && _b !== void 0 ? _b : null;
        // replace the continuation's root with current parent.
        // Note: we beleave the root have only 1 element in it.
        var croot_1 = (f.stack.length > 0) ? f.stack[0].parent : cparent;
        if (croot_1.length !== 1) {
            throw "Illeal root of continuation";
        }
        var cstack = f.stack.map(function (item) {
            if (item.parent === croot_1) {
                item.parent = cont.current.parent;
                item.index = cont.current.index;
            }
            return item;
        });
        return { ret: croot_1[0], subevals: cstack.reverse() };
    }
};
var SpecialFormHandlers = {
    // quote - not evaluate and return it.
    "`": function (_a) {
        var node = _a.node;
        return { ret: node[1] };
    },
    // eval - evaluate argument, and re-eval it.
    eval: function (_a) {
        var node = _a.node, flag = _a.flag;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            return { ret: node[1], reevals: [{ flag: null }] };
        }
    },
    // def - define
    def: function (_a) {
        var node = _a.node, env = _a.env, flag = _a.flag;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 2 }] };
        }
        else {
            var symbol = node[1], _b = node[2], v = _b === void 0 ? null : _b;
            assertSymbol(symbol);
            return { ret: setEnv(env, symbol, v) };
        }
    },
    // defdynamic - define dynamic variable
    defdynamic: function (_a) {
        var node = _a.node, dynamicEnv = _a.dynamicEnv, flag = _a.flag;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 2 }] };
        }
        else {
            var symbol = node[1], _b = node[2], v = _b === void 0 ? null : _b;
            assertSymbol(symbol);
            setEnv(getEnvRoot(dynamicEnv), symbol, v);
            return { ret: v };
        }
    },
    // ~ - define macro
    "~": function (_a) {
        var node = _a.node, flag = _a.flag;
        var cn = __spreadArrays(node);
        if (!flag) {
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            // Check if the evaluated value is applicable.
            assertApplicable(cn[1]);
            return { ret: cn };
        }
    },
    // ~~ - define half macro
    "~~": function (_a) {
        var node = _a.node, flag = _a.flag;
        var cn = __spreadArrays(node);
        if (!flag) {
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            // Check if the evaluated value is applicable.
            assertApplicable(cn[1]);
            return { ret: cn };
        }
    },
    // .- - get or set attribute/property, dereferencing BOR.
    ".-": function (_a) {
        var node = _a.node, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
        if (!flag) {
            var cn_4 = __spreadArrays(node);
            return {
                ret: cn_4,
                reevals: [{ flag: "!" }],
                subevals: cn_4.map(function (v, index) { return index >= 1 && { parent: cn_4, index: index }; }),
            };
        }
        else {
            var o = interpreter.derefBOR(node[1]);
            if (o === null || o === undefined) {
                throw "Can't read/set property of null or undefined.";
            }
            var _b = node.map(function (a) { return interpreter.derefBOR(a); }), prop = _b[2], v = _b[3];
            assertPropertyIndex(prop);
            return { ret: node.length === 3 ? o[prop] : o[prop] = v };
        }
    },
    // . - call/apply method
    ".": function (_a) {
        var node = _a.node, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
        if (!flag) {
            var cn_5 = __spreadArrays(node);
            return {
                ret: cn_5,
                reevals: [{ flag: "!" }],
                subevals: cn_5.map(function (v, index) { return index >= 1 && { parent: cn_5, index: index }; }),
            };
        }
        else {
            var o = interpreter.derefBOR(node[1]);
            if (o === null || o === undefined) {
                throw "Can't call method of null or undefined.";
            }
            var prop = node[2], args = node.slice(3);
            assertPropertyIndex(prop);
            if (typeof o[prop] === "function") {
                try {
                    return { ret: o[prop].apply(o, args.map(function (a) { return interpreter.wrapLambda(interpreter.derefBOR(a)); })) };
                }
                catch (e) {
                    if (isContinuation(e)) {
                        throw "Javascript methods can not throw any continuation.";
                    }
                    throw e;
                }
            }
            else {
                assertApplicable(o[prop]);
                return { ret: __spreadArrays([o[prop]], args), reevals: [{ flag: "!" }] };
            }
        }
    },
    // oget - get attribute/property, not dereferencing argument's BOR.
    // Note: maybe JSLambda can do this.
    oget: function (_a) {
        var node = _a.node, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
        if (!flag) {
            var cn_6 = __spreadArrays(node);
            return {
                ret: cn_6,
                reevals: [{ flag: "!" }],
                subevals: cn_6.map(function (v, index) { return index >= 1 && { parent: cn_6, index: index }; }),
            };
        }
        else {
            var o = interpreter.derefBOR(node[1]);
            if (o === null || o === undefined) {
                throw "Can't read property of null or undefined.";
            }
            var prop = node[2];
            assertPropertyIndex(prop);
            return { ret: o[prop] };
        }
    },
    // oset - set attribute/property, not dereferencing argument's BOR.
    // Note: maybe JSLambda can do this.
    oset: function (_a) {
        var node = _a.node, base = _a.base, flag = _a.flag, interpreter = _a.interpreter;
        if (!flag) {
            var cn_7 = __spreadArrays(node);
            return {
                ret: cn_7,
                reevals: [{ flag: "!" }],
                subevals: cn_7.map(function (v, index) { return index >= 1 && { parent: cn_7, index: index }; }),
            };
        }
        else {
            var o = interpreter.derefBOR(node[1]);
            if (o === null || o === undefined) {
                throw "Can't set property of null or undefined.";
            }
            var prop = node[2], v = node[3];
            assertPropertyIndex(prop);
            return { ret: o[prop] = v };
        }
    },
    // try-catch
    // Note: catch clause's car does't have any meaning in minimal.
    // Note: param is only one, not like `fn'.
    try: function (_a) {
        var node = _a.node, env = _a.env, dynamicEnv = _a.dynamicEnv, flag = _a.flag, cont = _a.cont, handler = _a.handler;
        assertTry(node);
        if (!flag) {
            var newErrorHandler = {
                parent: cont.current.parent,
                index: cont.current.index,
                env: newEnv(env, [], []),
                dynamicEnv: dynamicEnv,
                flag: "!!",
                handler: handler,
            };
            var cn = __spreadArrays(node);
            // return evaluation requests for children nodes and reevaluation.
            // Note: We must keep both body and catch-clause.
            // Note: We'll set new error handler to re-evaluation request,
            //       so that the request will be deleted when exception
            //       is caught.
            return {
                ret: cn,
                reevals: [{ flag: "!", handler: newErrorHandler }],
                subevals: [{ parent: cn, index: 1, handler: newErrorHandler }]
            };
        }
        else if (flag === "!") {
            // After body was evaluated, return value.
            var body = node[1];
            return { ret: body };
        }
        else if (flag === "!!") {
            // Catch. run with new environment like function.
            // Note: paremeter is already set in evalAST's catch clause.
            var _b = node[2], body = _b[2];
            return { ret: body, reevals: [{}] };
        }
        else {
            throw "Illegal status for try-catch.";
        }
    },
    // fn - function (define lamda)
    fn: function (_a) {
        var node = _a.node, env = _a.env;
        assertFn(node);
        // defining lambda ( List lambda or JS lambda)
        var params = node[1], body = node[2];
        return { ret: ["=>", params, body, env] };
    },
    // map - apply function/lambda to each items in a list
    // Note: Maybe can be implimented by macro.
    map: function (_a) {
        var node = _a.node, flag = _a.flag;
        if (!flag) {
            var cn_8 = __spreadArrays(node);
            return {
                ret: cn_8,
                reevals: [{ flag: "!" }],
                subevals: cn_8.map(function (v, index) { return index >= 1 && { parent: cn_8, index: index }; }),
            };
        }
        else {
            var f_1 = node[1], list_1 = node[2];
            assertList(list_1);
            var cl_1 = list_1.map(function (_, i) { return [f_1, list_1[i]]; });
            return {
                ret: cl_1,
                subevals: cl_1.map(function (v, index) { return ({ parent: cl_1, index: index, flag: "!" }); }),
            };
        }
    },
    // apply - apply function/lambda with arguments.
    apply: function (_a) {
        var node = _a.node, flag = _a.flag;
        if (!flag) {
            var cn_9 = __spreadArrays(node);
            return {
                ret: cn_9,
                reevals: [{ flag: "!" }],
                subevals: cn_9.map(function (v, index) { return index >= 1 && { parent: cn_9, index: index }; }),
            };
        }
        else {
            var f = node[1], args = node.slice(2);
            var last = args.pop();
            assertList(last); // The last argument must be a list
            args.push.apply(// The last argument must be a list
            args, last); // concatenate the last to other args.
            return {
                ret: __spreadArrays([f], args),
                reevals: [{ flag: "!" }],
            };
        }
    },
    // let - new environment with bindings
    // Translate to `do' form with new environment.
    let: function (_a) {
        var node = _a.node, env = _a.env;
        assertLet(node);
        var plist = node[1], body = node[2];
        if (plist.length % 2 === 1) {
            plist.push(null);
        }
        var ppairs = plist.reduce(function (acc, v, i) { return i % 2 ? acc : acc.concat([[plist[i], plist[i + 1]]]); }, []);
        return {
            ret: __spreadArrays(["do"], ppairs.map(function (_a) {
                var p = _a[0], v = _a[1];
                return ["def", p, v];
            }), [body]),
            reevals: [{ env: newEnv(env, [], []) }],
        };
    },
    // dynamic-let - new dynamic environment with bindings
    "dynamic-let": function (_a) {
        var node = _a.node, dynamicEnv = _a.dynamicEnv, flag = _a.flag;
        assertDynamicLet(node);
        if (!flag) {
            var f = node[0], plist = node[1], body = node[2];
            var cplist_1 = __spreadArrays(plist);
            return {
                ret: [f, cplist_1, body],
                subevals: cplist_1.map(function (v, i) { return i; }).filter(function (i) { return (i % 2) === 1; }).map(function (i) { return ({ parent: cplist_1, index: i }); }),
                reevals: [{ flag: "!" }],
            };
        }
        else {
            var plist_1 = node[1], body = node[2];
            if (plist_1.length % 2 === 1) {
                plist_1.push(null);
            }
            var ppairs = plist_1.reduce(function (acc, v, i) { return i % 2 ? acc : acc.concat([[plist_1[i], plist_1[i + 1]]]); }, []);
            var nenv_1 = newEnv(dynamicEnv, [], []);
            ppairs.forEach(function (_a) {
                var k = _a[0], v = _a[1];
                return setEnv(nenv_1, String(k), v);
            });
            return {
                ret: body,
                reevals: [{ dynamicEnv: nenv_1 }],
            };
        }
    },
    // do - multiple forms (for side-effects)
    // Note: `do' MUST dispose the result of evalation except the last one.
    // Note: last one substitutes the `do' form and re-evaluated not increasing stack.
    do: function (_a) {
        var node = _a.node;
        var args = node.slice(1);
        var _b = args.slice(-1)[0], last = _b === void 0 ? null : _b; // Note: last becomes null if no args.
        var rest = args.slice(0, -1);
        return {
            ret: last,
            reevals: [{ flag: null }],
            subevals: rest.map(function (v) { return ({ parent: [v], index: 0 }); }),
        };
    },
    // if - branching conditional
    if: function (_a) {
        var node = _a.node, flag = _a.flag;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            return { ret: node[1] ? node[2] : node[3], reevals: [{ flag: null }] };
        }
    },
    // suspend - throws continuation.
    suspend: function (_a) {
        var _b;
        var node = _a.node, flag = _a.flag, cont = _a.cont;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            var args = node.slice(1);
            cont.info = (_b = args[0]) !== null && _b !== void 0 ? _b : null;
            throw cont;
        }
    },
    // resume - resume the continuation.
    // Note: Can be implemented by macro.
    resume: function (_a) {
        var node = _a.node, flag = _a.flag;
        var cont = node[1], args = node.slice(2);
        assertContinuation(cont);
        return { ret: __spreadArrays([cont], args), reevals: [{ flag: "!" }] };
    },
    // Note: maybe we can implement a call/cc here.
    // dynamic - Look up and get value of dynamic variable.
    // Note: we don't have "setf" yet.
    dynamic: function (_a) {
        var node = _a.node, dynamicEnv = _a.dynamicEnv;
        var name = node[1];
        assertSymbol(name);
        var _b = findEnv(dynamicEnv, null, name), v = _b[0], found = _b[1];
        return { ret: found ? v : error("dynamic variable " + name + " not found") };
    },
    // await - throws ContinuablePromise.
    await: function (_a) {
        var node = _a.node, flag = _a.flag, cont = _a.cont, interpreter = _a.interpreter;
        if (!flag) {
            var cn = __spreadArrays(node);
            return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
        }
        else {
            var args = node.slice(1);
            throw new ContinuablePromise(interpreter, (args.length === 0) ? null : (args.length === 1) ? args[0] : Promise.all(args), cont);
        }
    },
};
// -------------------------------------------------------
//                Environment wrapper
// -------------------------------------------------------
// This class wraps environment (with base object) and provides get/has/set method.
// Used for passing environment information to JS lambdas.
var EnvWrapper = /** @class */ (function () {
    function EnvWrapper(env, dynamicEnv, callerEnv, base) {
        var _this = this;
        this.get = function (name) { return findEnv(_this.env, _this.base, name)[0]; };
        this.has = function (name) { return findEnv(_this.env, _this.base, name)[1]; };
        this.set = function (name, value) { return setEnv(_this.env, name, value); };
        this.dynamicGet = function (name) { return findEnv(_this.dynamicEnv, null, name)[0]; };
        this.dynamicHas = function (name) { return findEnv(_this.dynamicEnv, null, name)[1]; };
        this.dynamicSet = function (name, value) { return setEnv(getEnvRoot(_this.dynamicEnv), name, value); };
        this.dynamicSetLocal = function (name, value) { return setEnv(_this.dynamicEnv, name, value); };
        this.callerGet = function (name) { return findEnv(_this.callerEnv, _this.base, name)[0]; };
        this.callerHas = function (name) { return findEnv(_this.callerEnv, _this.base, name)[1]; };
        this.env = env;
        this.dynamicEnv = dynamicEnv;
        this.callerEnv = callerEnv;
        this.base = base;
    }
    return EnvWrapper;
}());
// This class wraps a promise and a continuation given to "await" function
// to enable to resume evaluation when the promise have been resolved.
// If a value is given instead of a promise, it is treated as a resolved value.
// This class also provides some utility functions to inspect the status
// syncronously just like BlueBird does.
// Note: We can't extend Promise class using Typescript. A workaround that is suggested
// on the link blow is having a internal promise and proxy it. We also do that.
// https://github.com/microsoft/TypeScript/issues/15202
var ContinuablePromise = /** @class */ (function () {
    function ContinuablePromise(interpreter, promise, continuation) {
        var _this = this;
        this.status = "pending";
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        this.interpreter = interpreter;
        this.coninuation = continuation;
        if (isPromiseLike(promise)) {
            promise.then(function (value) {
                _this.resolvedValue = value;
                _this.status = "fulfilled";
                _this.resolve();
            }, function (reason) {
                _this.rejectedReason = reason;
                _this.status = "rejected";
                _this.reject(reason);
            });
        }
        else {
            this.resolvedValue = promise;
            this.status = "fulfilled";
            this.resolve();
        }
    }
    // Utility functions to inspect status.
    ContinuablePromise.prototype.isFulfilled = function () {
        return this.status === "fulfilled";
    };
    ContinuablePromise.prototype.isRejected = function () {
        return this.status === "rejected";
    };
    ContinuablePromise.prototype.isPending = function () {
        return this.status === "pending";
    };
    ContinuablePromise.prototype.reason = function () {
        if (!this.isRejected()) {
            throw new Error("The promise is not rejected yet.");
        }
        return this.rejectedReason;
    };
    // Resumes evaluation.
    // Note that this method can be called after the promise was fulfilled(resolved).
    // Otherwise this method throws an error.
    ContinuablePromise.prototype.resume = function () {
        if (!this.isFulfilled()) {
            throw new Error("The promise is not fulfilled yet.");
        }
        return this.interpreter.resume(this.coninuation, this.resolvedValue);
    };
    ContinuablePromise.prototype.then = function (onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    };
    ContinuablePromise.prototype.catch = function (onRejected) {
        return this.promise.catch(onRejected);
    };
    return ContinuablePromise;
}());
// -------------------------------------------------------
//                    Default base
// -------------------------------------------------------
// eslint-disable-next-line
var TheGlobal = globalThis || window || global || this;
var DEFAULT_BASE = Object.assign(Object.create(TheGlobal), {
    "=": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return a[0] === a[1];
    },
    "<": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return Number(a[0]) < Number(a[1]);
    },
    "+": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return Number(a[0]) + Number(a[1]);
    },
    "-": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return Number(a[0]) - Number(a[1]);
    },
    "*": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return Number(a[0]) * Number(a[1]);
    },
    "/": function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return Number(a[0]) / Number(a[1]);
    },
    isa: function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return a[0] instanceof a[1];
    },
    type: function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return typeof a[0];
    },
    new: function () {
        var _a;
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return new ((_a = a[0]).bind.apply(_a, a))();
    },
    del: function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return delete a[0][a[1]];
    },
    //"list":  (...a) => a,
    //"map":   (...a) => a[1].map(x => a[0](x)),
    throw: function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        throw a[0];
    },
    read: function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        return JSON.parse(a[0]);
    },
    // eslint-disable-next-line no-eval
    js: eval,
});

exports.ContinuablePromise = ContinuablePromise;
exports.EnvWrapper = EnvWrapper;
exports.Interpreter = Interpreter;
exports.LANGUAGE = LANGUAGE;
exports.TheGlobal = TheGlobal;
exports.VERSION = VERSION;
exports.cloneAST = cloneAST;
exports.findEnv = findEnv;
exports.isApplicable = isApplicable;
exports.isBOR = isBOR;
exports.isContinuation = isContinuation;
exports.isEnv = isEnv;
exports.isHalfMacro = isHalfMacro;
exports.isLambda = isLambda;
exports.isMacro = isMacro;
exports.isPromiseLike = isPromiseLike;
exports.newEnv = newEnv;
exports.setEnv = setEnv;
