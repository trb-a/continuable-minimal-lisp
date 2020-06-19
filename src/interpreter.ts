// IMPROVEME: Async support. It's too much at this moment.
//   Using async - await changes everything async, that makes everything slow.
//   Use this way => https://codesandbox.io/s/asyncguanshukaratongqidezhiwofansukorubatukuwoshiebakeneng-mqdff
// IMPROVEME: With Await support, we can imprement `slurp` as fetch.
// -----------

/* eslint-disable no-loop-func */
/* eslint-disable no-throw-literal */

// -------------------------------------------------------
//                       Consant
// -------------------------------------------------------
export const LANGUAGE = "Continuable-miniMAL-Lisp";
export const VERSION = "0.0.1";

// -------------------------------------------------------
//                   Type definitions
// -------------------------------------------------------

// Expr accepts almost evrything. Defined just to avoid using `any'.
type Expr = Expr[] | bigint | boolean | ((...args: any[]) => any) | number
  | object | string | symbol | undefined | null;

type Env = [Record<string, Expr>, Env | null]; // [bound symbols, upper env]

// Base object acts like parent of root environment, but not referenced by
// Env object.
type Base = { [x: string]: any };

// Base object reference (BOR) referes any property in the Base which
// can be accessed by string instead of having refered object itself
// to keep environment and AST serializable as far as possible.
// BOR is created when you refer your environment to get something
// from the Base, and dereferenced when you use it ( passing it to
// JS functions, accessing property, etc )
export type BOR = { bor: string };

// Applicables.
export type Lambda = ["=>", string[], Expr, Env] | ["=>", JSFunction];
type JSFunction = (...args: any[]) => any;
export type Continuation = {
  current: Eval,
  stack: EvalStack,
  info?: Expr, // Can set a information whatever.
  lang: string,
  version: string,
};
type Applicable = Lambda | JSFunction | Continuation;

// Evaluation stack. [<parent>, <index>, <env>, <flag>, error-handler]
// Parent can be AST node or Env.
export type Eval = { parent: Expr[], index: number, env: Env, flag: string | null, handler: Eval | null };
export type EvalStack = Eval[];

// Interpreter options.
export type Options = {
  stackMax?: number, // Stack size. Throw error when exceed this.
  base?: Base, // Upper of root environment.
  env?: Env, // Environment root (except base).
  loadCore?: boolean, // Load core on construct or not.
  debugMode?: boolean, // Show debug messsage using console.log if true.
  debugMax?: number, // Throw error if debugCount exceeds this.
  debugFilter?: (message: string) => boolean, // Filter debug message, before checking debugMax.
};

// Function to handle a form.
type FormHandler = (args: {
  node: Readonly<Expr[]>,
  env: Env,
  base: Base,
  flag: string | null,
  handler: Eval | null,
  cont: Continuation,
  debug: (message: string, ...args: any[]) => void, // Useful for debugging
}) => {
  ret: Expr,
  subevals?: (Partial<Eval> | null | undefined | false)[], // falsy values will be eliminaed.
  reevals?: Partial<Eval>[],
};

// Others.
type Fn = ["fn", string[], Expr];
type Try = ["try", Expr, [any, "string", Expr]];
type Let = ["let", Expr[], Expr];

// -------------------------------------------------------
//                   Utilities
// -------------------------------------------------------

// Creates a deep clone of given AST recursively.
// Arrays and simple objects are cloned. Instances of classes are not.
export const cloneAST = (ast: any, map = new Map<any, any>()): Expr => {
  if (map.has(ast)) {
    return map.get(ast);
  } else if (typeof ast === "object" && ast !== null && ast.constructor === Object) {
    return Object.keys(ast).reduce((acc, key) => {
      acc[key] = cloneAST(ast[key], map);
      return acc;
    }, {} as any);
  } else if (ast instanceof Array) {
    const arr = map.set(ast, []).get(ast)! as Expr[];
    arr.push(...ast.map((a: Expr) => cloneAST(a, map)));
    return arr;
  } else {
    return ast;
  }
};

// throws string.
// Note: Javascript's stacktrace is meaningless for lisp errors.
// IMPROVEME: implement lisp stacktrace.
const error = (str: string): never => {
  throw str;
}

// const isPromise = <T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> =>
//   !!obj && (typeof obj === "object" || typeof obj === "function") &&
//   typeof (obj as any).then === "function";

// -------------------------------------------------------
//               Type guards / asserts
// -------------------------------------------------------

// Asserts x is string. Use this before setEnv or findEnv.
const assertSymbol: (x: any) => asserts x is string = (x) =>
  (typeof x === "string") || error(`${x} is not a symbol`);

// Asserts x is object. (Not work well)
// const assertObject: (x: any) => asserts x is Record<string, any> = (x) =>
//   (typeof x === "object" && x !== null) || error(`${x} is not a object`);

const assertPropertyIndex: (x: any) => asserts x is "string" | "number" | "symbol" = (x) => (
  typeof x === "string" || typeof x === "symbol" ||
  typeof x === "number" || error("String(x) is not a property index")
);

export const isBOR = (base: Base, x: any): x is BOR =>
  typeof x === "object" && x !== null && typeof x["bor"] === "string" &&
  x["bor"] in base;

// Determines if x is AST[].
const isList = (x: any): x is Expr[] => (x instanceof Array);

// Asserts x is AST[].
const assertList: (x: any) => asserts x is Expr[] = (x) =>
  isList(x) || error(`${x} is not an array`);

// Determines if x is Env.
// Note: we don't get deep into parents, that's heavy & too much.
export const isEnv = (x: any): x is Env =>
  x instanceof Array &&
  typeof x[0] === "object" && x[0] !== null &&
  (x[1] instanceof Array || x[1] === null); // can be !x[1] || isEnv(x[1])

// Determines if x is a lambda
export const isLambda = (x: any): x is Lambda =>
  x instanceof Array && (
    (x.length === 4 && x[0] === "=>" && (isEnv(x[3])) &&
      (x[1] instanceof Array && x[1].every(a => typeof a === "string"))) ||
    (x.length === 2 && x[0] === "=>" && isJSFunction(x[1]))
  );

// Determines if x is a JSLambda
const isJSFunction = (x: any): x is JSFunction =>
  typeof x === "function";

export const isApplicable = (x: any): x is Applicable =>
  isLambda(x) || isJSFunction(x) || isContinuation(x);

const assertApplicable: (x: any) => asserts x is Applicable = (x) =>
  isApplicable(x) || error(`${x} is not a applicable`);

// const assertJSFunction: (x: any) => asserts x is JSFunction = (x) =>
//   typeof x === "function" || error(`${x} is not a JS function`);

const isEval = (x: any): x is Eval =>
  typeof x === "object" && x !== null &&
  x["parent"] instanceof Array &&
  typeof x["index"] === "number" &&
  isEnv(x["env"]) &&
  (x["flag"] === null || typeof x["flag"] === "string") &&
  typeof x["handler"] === "object" // Note: null | object. We don't get in deep.

// Note: Not cheking everything, but just surface.
// Checks format version at the same time.
export const isContinuation = (x: any): x is Continuation =>
  typeof x === "object" && x !== null &&
  isEval(x["current"]) &&
  x["stack"] instanceof Array &&
  typeof x["version"] === "string" &&
  x["version"].replace(/\.[^.]+$/, "") === VERSION.replace(/\.[^.]+$/, "");

const assertContinuation: (x: any) => asserts x is Continuation = (x) =>
  isContinuation(x) || error(`${x} is not a continuation`);;

// Determine if x is a function
const isFn = (x: any): x is Fn =>
  x instanceof Array && x.length === 3 &&
  x[0] === "fn" &&
  (x[1] instanceof Array && x[1].every(a => typeof a === "string"));

// Assert x is "fn" form
const assertFn: (x: any) => asserts x is Fn = (x) =>
  isFn(x) || error(`${x} is not a function or malformed`);

// Assert x is "try" form
const assertTry: (x: any) => asserts x is Try = (x) =>
  x instanceof Array && x[0] === "try" &&
  x[2] instanceof Array && typeof x[2][1] === "string" && x[2].length >= 3;

// Assert x is "let" form
const assertLet: (x: any) => asserts x is Let = (x) =>
  x instanceof Array && x[0] === "let" &&
  x[1] instanceof Array && x.length >= 3;

// -- handling BOR. --
// create BOR from a string.
// if the string is not in BaseAAA, exception occurs.
export const newBOR = (base: Base, prop: string): BOR =>
  (prop in base) ? { bor: prop } : error(`${prop} is not a property of base object`);

// Dereference if the given argument is a BOR.
export const derefBOR = (base: Base, ast: Expr) => isBOR(base, ast) ? base[ast.bor] : ast;

// Dereference BOR if the given array has BOR.
const derefBORArray = (base: Base, ast: readonly Expr[]) => ast.map(a => derefBOR(base, a));

// -------------------------------------------------------
//  Create, set data to, and get data from the environment.
// -------------------------------------------------------

// Return new Env with symbols in ast bound to
// corresponding values. "variadic" option allows
// clojure style variadic parameters.
export const newEnv = (upper: Env, symbols: string[], values: Expr[], variadic = true): Env => {
  const bounds: Record<string, Expr> = {};
  for (let i = 0; i < symbols.length; i++) {
    if (variadic && symbols[i] === "&") {
      bounds[`${symbols[i + 1]}`] = values.slice(i);
      break;
    } else {
      bounds[`${symbols[i]}`] = values[i];
    }
  }
  return [bounds, upper];
};

// bind a value with a symbol in the environment.
export const setEnv = <T extends Expr>(env: Env, symbol: string, value: T): T =>
  (env[0][`${symbol}`] = value);


// get value and whether existance of the symbol from environment or Base.
// returns: [<found value or null>, <found or not>, <BOR or not>]
export const findEnv = (env: Env, base: Base, symbol: string): [Expr, boolean, boolean] => {
  for (let e: Env | null = env; !!e; e = e[1]) {
    if (e[0].hasOwnProperty(symbol)) {
      return [e[0][symbol], true, false];
    } else if (
      !e[1] && symbol in base && base[symbol] !== null &&
      (typeof base[symbol] === "object" || typeof base[symbol] === "function")
    ) {
      return [newBOR(base, symbol), true, true];
    }
  }
  return [null, false, false];
};

// -------------------------------------------------------
//               Interpreter class
// -------------------------------------------------------

export class Interpreter {
  private stackMax: number = Infinity; // Stack size. Throws error when exceeds.
  /* eslint-disable-next-line no-use-before-define */
  private base: Base = DEFAULT_BASE; // upper of root environment.
  private env: Env = [{}, null]; // environment root (except base).
  private loadCore: boolean = true; // load core on construct or not.

  // for debugging
  public debugCount: number = 0; // Counts how may times debug message shown.
  public debugMode: boolean = false; // Show debug messsage if true.
  public debugMax: number = Infinity; // Throws error if debugCount exceeds this.
  public debugFilter: (message: string) => boolean = () => true;

  constructor(options?: Options) {
    Object.assign(this, options);
    if (this.loadCore) {
      this.evalInBase(require("./core.json"));
    }
  }

  // Show debug message on console.
  private debug = (message: string, ...args: any[]) => {
    if (!this.debugMode || !this.debugFilter(message)) {
      return;
    }
    args = args.map(a => a instanceof Array ? cloneAST(a) : a);
    console.log(message, ...args);
    this.debugCount++;
    if (this.debugCount > this.debugMax) {
      throw new Error("too many debug message!");
    }
  }

  // Evaluates the given AST and retuns the result.
  private evalAST = (ast: Expr, env = this.env): Expr | Promise<Expr> => {

    // Root container contains the given AST.
    // This enables replacement of the value even for scalar value.
    const root = [ast];
    // Evaluation stack contains evaluation requests with environment.
    // The initial value includes the root container above.

    const stack: EvalStack = [{ parent: root, index: 0, env, flag: null, handler: null }];

    // A utility function the push evaluation requests on the stack.
    // The evaluation will be done in the given order.
    // Throws an exception if the given items + stacked items exceeds QUEUE_MAX.
    const pushEvalStack = (ev: Eval): Eval => (stack.length >= this.stackMax)
      ? error("Stack overflow") : (stack.push(ev), ev);

    // Continue evaluation until the stack becomes empty.
    while (stack.length) {
      this.debug("Current eval-stack length, eval-stack", stack.length, stack);
      const current = stack.pop()!;
      const { parent, index, env, flag, handler } = current;
      const node: Expr = parent[index];
      this.debug("Next evaluating AST node, environment, flag", node, env, flag);

      try {
        if (typeof node === "string") {
          // Symbol - Look up it from the environment.
          const [v, found] = findEnv(env, this.base, node);
          parent[index] = found ? v : error(`${node} not found`);

        } else if (isList(node)) {
          // Form - Apply it.

          // Select form handler.
          // If the car is symbol, get the value from the environment
          // to determine if this is a macro form or coninuation form.
          const envv = (typeof node[0] === "string") ? derefBOR(this.base, findEnv(env, this.base, node[0])[0]) : null;
          const formHandler = (envv instanceof Array && envv[0] === "~") ? (
            MacroHandler
          ) : (typeof node[0] === "string" && SpecialFormHandlers.hasOwnProperty(node[0])) ? (
            SpecialFormHandlers[node[0]]
          ) : (isContinuation(node[0]) || isContinuation(envv)) ? (
            ContinuationFormHandler
          ) : StandardFormHandler;

          // Apply the selected form handler.
          const { ret, subevals, reevals } = formHandler({
            node, env, base: this.base, flag, handler,
            cont: { current, stack, lang: LANGUAGE, version: VERSION },
            debug: this.debug
          });

          // Push on evaluattion stack and substitute the AST according to the return values.
          reevals?.reverse().forEach(ev => pushEvalStack({
            parent: ev.parent ?? parent,
            index: ev.index ?? index,
            env: ev.env ?? env,
            flag: ev.flag ?? null,
            handler: ev.handler ?? handler
          }));
          subevals?.reverse().forEach(ev => ev && pushEvalStack({
            parent: ev.parent ?? parent,
            index: ev.index ?? index,
            env: ev.env ?? env,
            flag: ev.flag ?? null,
            handler: ev.handler ?? handler
          }));
          parent[index] = ret;

        } else {
          // Not a symbol or form - Evaluated as is. Don't change the AST.
        }
      } catch (e) {
        if (isContinuation(e)) {
          // Thrown continuation does not be caught by try-catch.
          this.debug("Suspend", e);
          throw e;
        } else {
          // Exception.
          this.debug("Exception", e);
          if (handler) {
            // Set the exception to the catch clause's environment.
            const tryNode = handler.parent[handler.index];
            assertTry(tryNode);
            const [, , [, param]] = tryNode;
            setEnv(handler.env, param, e);
            // Remove evaluation requests in try-clause, which have this error handler.
            stack.splice(0, stack.length, ...stack.filter(ev => ev.handler !== handler));
            // Request to evaluate catch-clause.
            pushEvalStack(handler);
          } else {
            // No error handler.
            throw e;
          }
        }
      } finally {
        this.debug("Evaluation Done. AST, environment", parent[index], env);
      }
    }

    // return the evaluated value in the container at last.
    this.debug("Result", root[0]);
    return root[0];
  }

  // They are for external use.
  public eval = (ast: Expr) => {
    return this.evalAST(ast);
  }

  // Evaluate JSON & result as JSON using JSON.parse & JSON.stringify.
  // JSON.parse/stringify may throw exception.
  // If JSON.stringify trows an circular/cyclic structure error, returns undefined
  // instead of throwing exception.
  public rep = (input: string) => {
    try {
      return JSON.stringify(this.eval(JSON.parse(input)));
    } catch (e) {
      if (e instanceof TypeError && e.message.match(/(circular|cyclic)/i)) {
        return undefined; // returns undefined if the value contains functions anyway.
      }
      throw e;
    }
  }

  // Used for loading core.json.
  public evalInBase = (ast: Expr) => {
    this.evalAST(ast, [this.base, null]);
  }
}

// -------------------------------------------------------
//                Form handlers
// -------------------------------------------------------

// Standard form
const StandardFormHandler: FormHandler = ({ node, env, base, flag }) => {
  if (!flag) {
    const cn = [...node];
    return {
      ret: cn,
      reevals: [{ flag: "!" }],
      subevals: cn.map((v, index) => ({ parent: cn, index, env })),
    };
  } else if (flag === "!") {
    const [, ...args] = node;
    const f = derefBOR(base, node[0]);
    // apply function.
    if (isJSFunction(f)) {
      return { ret: f(...derefBORArray(base, args)) };
    } else if (isLambda(f)) {
      if (typeof f[1] === "function") {
        // JS lamdda. Difference between JS function and JS lambda is whether deref BOR
        // or not.
        return { ret: f[1](args) };
      } else {
        // Lisp lambda. create a new environment with arguments mapped to parameters
        // then evaluate the body.
        const [, params, body, e] = f;
        return { ret: body, reevals: [{ env: newEnv(e!, params, args) }] };
      }
    } else {
      throw `${String(f)} is not applicable`;
    }
  } else {
    throw `Unexpedted flag ${flag}`;
  }
}

// Macro form
// Note: Differences macros and non-special functions are
//   1. Macros don't evaluate the arguments.
//   2. Macros request re-evaluation of the results.
//   3. Macros can be applied by symbols.
//   4. (Undocumented feature): can wrap special functions like fn/def/etc
const MacroHandler: FormHandler = ({ node, env, base }) => {
  assertSymbol(node[0]);
  const v = derefBOR(base, findEnv(env, base, node[0])[0]);
  assertList(v); // We can almost beleave this is OK. Check was done when defined.
  assertApplicable(v[1]);
  // Apply the applicable and re-evaluate after that ( = 2 reevals )
  return { ret: [v[1], ...node.slice(1)], reevals: [{ flag: "!" }, { flag: null }] };
}

// Continuation form
const ContinuationFormHandler: FormHandler = ({ node, env, flag, cont }) => {
  if (!flag) {
    // Evaluate the argument. (In the current environment, Not in the continuation's one)
    const cn = [...node];
    return {
      ret: cn,
      reevals: [{ flag: "!" }],
      subevals: cn.map((v, index) => ({ parent: cn, index })),
    };
  } else {
    // Mount the continuation on the current AST, stack, and handlers.
    const [f, ...args] = node;
    assertContinuation(f);
    // Pass the given argument to the suspender.
    const { parent: cparent, index: cindex } = f.current;
    cparent[cindex] = args[0] ?? null;
    // replace the continuation's root with current parent.
    // Note: we beleave the root have only 1 element in it.
    const croot = (f.stack.length > 0) ? f.stack[0].parent : cparent;
    if (croot.length !== 1) {
      throw "Illeal root of continuation";
    }
    const cstack = f.stack.map(item => {
      if (item.parent === croot) {
        item.parent = cont.current.parent;
        item.index = cont.current.index;
      }
      return item;
    });
    return { ret: croot[0], subevals: cstack.reverse() };
  }
}

const SpecialFormHandlers: Record<string, FormHandler> = {

  // quote - not evaluate and return it.
  "`": ({ node }) => {
    return { ret: node[1] };
  },

  // eval - evaluate argument, and re-eval it.
  eval: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      return { ret: node[1], reevals: [{ flag: null }] };
    }
  },

  // def - define
  def: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 2 }] };
    } else {
      const [, symbol, v = null] = node;
      // We don't allow JS functions stored in environment.
      if (typeof v === "function") {
        throw "Can't define JS function (Set it as property in the base object instead)";
      }
      assertSymbol(symbol);
      return { ret: setEnv(env, symbol, v) };
    }
  },

  // ~ - define macro
  "~": ({ node, env, base, flag }) => {
    const cn = [...node];
    if (!flag) {
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      // Check if the evaluated value is applicable.
      assertApplicable(cn[1]);
      return { ret: cn };
    }
  },

  // .- - get or set attribute/property, dereferencing BOR.
  ".-": ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = derefBOR(base, node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't read/set property of null or undefined.";
      }
      const [, , prop, v] = derefBORArray(base, node);
      assertPropertyIndex(prop);
      return { ret: node.length === 3 ? o[prop] : o[prop] = v };
    }
  },

  // . - call/apply method
  ".": ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = derefBOR(base, node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't call method of null or undefined.";
      }
      const [, , prop, ...args] = node;
      assertPropertyIndex(prop);
      if (typeof o[prop] === "function") {
        return { ret: o[prop].apply(o, derefBORArray(base, args)) };
      } else {
        assertApplicable(o[prop]);
        return { ret: [o[prop], ...args], reevals: [{ flag: "!" }] };
      }
    }
  },

  // .- - get attribute/property, not dereferencing argument's BOR.
  // Note: maybe JSLambda can do this.
  oget: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = derefBOR(base, node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't read property of null or undefined.";
      }
      const [, , prop] = node;
      assertPropertyIndex(prop);
      return { ret: o[prop] };
    }
  },

  // .- - set attribute/property, not dereferencing argument's BOR.
  // Note: maybe JSLambda can do this.
  oset: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = derefBOR(base, node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't set property of null or undefined.";
      }
      const [, , prop, v] = node;
      assertPropertyIndex(prop);
      return { ret: o[prop] = v };
    }
  },

  // try-catch
  // Note: catch clause's car does't have any meaning in minimal.
  // Note: param is only one, not like `fn'.
  try: ({ node, env, base, flag, cont, handler }) => {
    assertTry(node);
    if (!flag) {
      const newErrorHandler: Eval = {
        parent: cont.current.parent,
        index: cont.current.index,
        env: newEnv(env, [], []), // catch-clause runs on new env.
        flag: "!!", // Evaluate lambda.
        handler, // Parent's error handler.
      };
      const cn = [...node];
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
    } else if (flag === "!") {
      // After body was evaluated, return value.
      const [, body] = node;
      return { ret: body };
    } else if (flag === "!!") {
      // Catch. run with new environment like function.
      // Note: paremeter is already set in evalAST's catch clause.
      const [, , [, , body]] = node;
      return { ret: body, reevals: [{}] }
    } else {
      throw "Illegal status for try-catch."
    }
  },

  // fn - function (define lamda)
  fn: ({ node, env, base, flag }) => {
    assertFn(node);
    const [, params, body] = node;
    return { ret: ["=>", params, body, env] };
  },

  // map - apply function/lambda to each items in a list
  // Note: Maybe can be implimented by macro.
  map: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const [, f, list] = node;
      assertList(list);
      const cl = list.map((_: any, i) => [f, list[i]]);
      return {
        ret: cl,
        subevals: cl.map((v, index) => ({ parent: cl, index, flag: "!" })),
      };
    }
  },

  // apply - apply function/lambda with arguments.
  apply: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const [, f, ...args] = node;
      const last = args.pop();
      assertList(last); // The last argument must be a list
      args.push(...last); // concatenate the last to other args.
      return {
        ret: [f, ...args],
        reevals: [{ flag: "!" }],
      };
    }
  },

  // let - new environment with bindings
  // Translate to `do' form with new environment.
  let: ({ node, env, base, flag }) => {
    assertLet(node);
    const [, plist, body] = node;
    if (plist.length % 2 === 1) {
      plist.push(null);
    }
    const ppairs = plist.reduce<[Expr, Expr][]>(
      (acc, v, i) => i % 2 ? acc : acc.concat([[plist[i], plist[i + 1]]]),
      []
    );
    return {
      ret: ["do", ...ppairs.map(([p, v]) => ["def", p, v]), body],
      reevals: [{ env: newEnv(env, [], []) }],
    }
  },

  // do - multiple forms (for side-effects)
  // Note: `do' MUST dispose the result of evalation except the last one.
  // Note: last one substitutes the `do' form and re-evaluated not increasing stack.
  do: ({ node, env, base, flag }) => {
    const [, ...args] = node;
    const [last = null] = args.slice(-1); // Note: last becomes null if no args.
    const rest = args.slice(0, -1);
    return {
      ret: last, // replace `do' from
      reevals: [{ flag: null }],
      subevals: rest.map(v => ({ parent: [v], index: 0 })), // Note: creating array means dispose results.
    };
  },

  // if - branching conditional
  if: ({ node, env, base, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      return { ret: node[1] ? node[2] : node[3], reevals: [{ flag: null }] };
    }
  },

  // suspend - throws continuation.
  suspend: ({ node, env, base, flag, cont }) => {
    const [, ...args] = node;
    cont.info = args[0] ?? null;
    throw cont;
  },

  // resume - resume the continuation.
  // Note: Can be implemented by macro.
  resume: ({ node, env, base, flag }) => {
    const [, cont, ...args] = node;
    assertContinuation(cont);
    return { ret: [cont, ...args], reevals: [{ flag: "!" }] }
  },
  // Note: maybe we can implement a call/cc here.
};

// -------------------------------------------------------
//                    Default base
// -------------------------------------------------------

// eslint-disable-next-line
export const TheGlobal = globalThis || window || global || this;

const DEFAULT_BASE: Base = Object.assign(Object.create(TheGlobal), {
  "=": (...a: Expr[]) => a[0] === a[1],
  "<": (...a: Expr[]) => Number(a[0]) < Number(a[1]),
  "+": (...a: Expr[]) => Number(a[0]) + Number(a[1]),
  "-": (...a: Expr[]) => Number(a[0]) - Number(a[1]),
  "*": (...a: Expr[]) => Number(a[0]) * Number(a[1]),
  "/": (...a: Expr[]) => Number(a[0]) / Number(a[1]),
  isa: (...a: Expr[]) => a[0] instanceof (a[1] as any),
  type: (...a: Expr[]) => typeof a[0],
  new: (...a: Expr[]) => new ((a[0] as any).bind(...a))(),
  del: (...a: Expr[]) => delete (a[0] as any)[a[1] as any],
  //"list":  (...a) => a,
  //"map":   (...a) => a[1].map(x => a[0](x)),
  throw: (...a: Expr[]) => {
    throw a[0];
  },

  read: (...a: Expr[]) => JSON.parse(a[0] as any),

  // eslint-disable-next-line no-eval
  js: eval,
  //"slurp": (...a) => require("fs").readFileSync(a[0],"utf8"),
  //"load":  (...a) => EVAL(JSON.parse(require("fs").readFileSync(a[0],"utf8")),E),
  load: ["fn", ["a"], ["eval", ["require", "a"]]],
});

export default Interpreter;
