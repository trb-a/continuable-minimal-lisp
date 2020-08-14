/* eslint-disable no-loop-func */
/* eslint-disable no-throw-literal */

// -------------------------------------------------------
//                       Consant
// -------------------------------------------------------
export const LANGUAGE = "Continuable-miniMAL-Lisp";
export const VERSION = "0.4.3";

// -------------------------------------------------------
//                   Type definitions
// -------------------------------------------------------

// Expr accepts almost evrything. Defined just to avoid using `any'.
export type Expr = Expr[] | bigint | boolean | JSFunction | number
  | object | string | symbol | undefined | null;

export type Env = [Record<string, Expr>, Env | null]; // [bound symbols, upper env]

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
export type Lambda = ["=>", string[], Exclude<Expr, JSFunction> | JSLambdaFunction, Env]; // JS Labmda or Lisp labmda

export type Macro = ["~", Applicable];

export type HalfMacro = ["~~", Applicable];

type JSFunction = (...args: any[]) => any;

export type Continuation = {
  current: Eval,
  stack: EvalStack,
  info: Expr | null, // Can set a information whatever.
  lang: string,
  version: string,
};
type Applicable = Lambda | JSFunction | Continuation | Macro | HalfMacro;

// Evaluation stack.
export type Eval = { parent: Expr[], index: number, env: Env, flag: string | null, dynamicEnv: Env, handler: Eval | null };
export type EvalStack = Eval[];

// Interpreter options.
export type Options = {
  stackMax?: number, // Stack size. Throw error when exceed this.
  base?: Base, // Upper of root environment.
  env?: Env, // Environment root (except base).
  loadCore?: boolean, // Load core on construct or not.
  debugMode?: boolean, // Show debug messsage using console.log if true.(except loading core)
  debugCore?: boolean, // Show debug message when loading core.
  debugMax?: number, // Throw error if debugCount exceeds this.
  debugFilter?: (message: string) => boolean, // Filter debug message, before checking debugMax.
};

// Function to handle a form.
type FormHandler = (args: {
  node: Readonly<Expr[]>,
  env: Env,
  dynamicEnv: Env,
  base: Base,
  flag: string | null,
  handler: Eval | null,
  cont: Continuation,
  interpreter: Interpreter,
}) => {
  ret: Expr,
  subevals?: (Partial<Eval> | null | undefined | false)[], // falsy values will be eliminaed.
  reevals?: Partial<Eval>[],
};

// Fn form. Export this because they might define functions out of interpreter.
export type JSLambdaFunction = (env: EnvWrapper, itrp: Interpreter) => Expr;
export type Fn = ["fn", string[], Exclude<Expr, JSFunction> | JSLambdaFunction];

// Others.
type Try = ["try", Expr, [any, "string", Expr]];
type Let = ["let", Expr[], Expr];
type DynamicLet = ["dynamic-let", Expr[], Expr];

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

// Throws string.
// Note: Javascript's stacktrace is meaningless for lisp errors.
// IMPROVEME: implement lisp stacktrace.
const error = (str: string): never => {
  throw str;
}

// Delete all the keys with undefined value in a object.
const deleteUndefined = (obj: any): void => {
  if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).filter(k => obj[k] === undefined).forEach(k => delete obj[k]);
  }
}

export const isPromiseLike = <T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> =>
  !!obj && (typeof obj === "object" || typeof obj === "function") &&
  typeof (obj as any).then === "function";

// -------------------------------------------------------
//               Type guards / asserts
// -------------------------------------------------------

// Asserts x is string. Use this before setEnv or findEnv.
const assertSymbol: (x: any) => asserts x is string = (x) =>
  (typeof x === "string") || error(`${x} is not a symbol`);

// Asserts x is string or number or symbol.
const assertPropertyIndex: (x: any) => asserts x is "string" | "number" | "symbol" = (x) => (
  typeof x === "string" || typeof x === "symbol" ||
  typeof x === "number" || error("String(x) is not a property index")
);

// Asserts x is BOR.
// Strict check so that we don't take user's object as BOR as far as possible.
// Note: We recommend to use Map instead of object for dictionary, if serializer accept Map.
export const isBOR = (base: Base, x: any): x is BOR =>
  typeof x === "object" && x !== null && typeof x["bor"] === "string" &&
  x.constructor === Object && Object.keys(x).length === 1 && x["bor"] in base;

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

// Determines if x is a lambda ( Lisp labmda or JS lambda)
export const isLambda = (x: any): x is Lambda =>
  x instanceof Array && x[0] === "=>" && x.length === 4 && isEnv(x[3]) && (
    (x[1] instanceof Array && x[1].every(a => typeof a === "string"))
  );

export const isMacro = (x: any): x is Macro =>
  x instanceof Array && x[0] === "~" && x.length === 2
  && isApplicable(x[1]);

  export const isHalfMacro = (x: any): x is HalfMacro =>
  x instanceof Array && x[0] === "~~" && x.length === 2
  && isApplicable(x[1]);

// Determines if x is a JSFunction
const isJSFunction = (x: any): x is JSFunction =>
  typeof x === "function";

// Determines if x is a lambda, js function or continuation.
export const isApplicable = (x: any): x is Applicable =>
  isLambda(x) || isJSFunction(x) || isContinuation(x) || isMacro(x) || isHalfMacro(x);

// Asserts if x is a lambda, js function or continuation.
const assertApplicable: (x: any) => asserts x is Applicable = (x) =>
  isApplicable(x) || error(`${x} is not a applicable`);

const assertMacro: (x: any) => asserts x is Macro = (x) =>
  isMacro(x) || error(`${x} is not a macro`);

const assertHalfMacro: (x: any) => asserts x is HalfMacro = (x) =>
  isHalfMacro(x) || error(`${x} is not a half macro`);

// const assertJSFunction: (x: any) => asserts x is JSFunction = (x) =>
//   typeof x === "function" || error(`${x} is not a JS function`);

// Determines if x is evaluation request.
const isEval = (x: any): x is Eval =>
  typeof x === "object" && x !== null &&
  x["parent"] instanceof Array &&
  typeof x["index"] === "number" &&
  isEnv(x["env"]) &&
  (x["flag"] === null || typeof x["flag"] === "string") &&
  typeof x["handler"] === "object" // Note: null | object. We don't get in deep.

// Determines if x is continuation (suspended runtime state)
// Note: Not cheking everything, but just surface.
// Checks format version at the same time.
export const isContinuation = (x: any): x is Continuation =>
  typeof x === "object" && x !== null &&
  isEval(x["current"]) &&
  x["stack"] instanceof Array &&
  typeof x["version"] === "string" &&
  x["version"].replace(/\.[^.]+$/, "") === VERSION.replace(/\.[^.]+$/, "");

// Asserts if x is continuation (suspended runtime state)
const assertContinuation: (x: any) => asserts x is Continuation = (x) =>
  isContinuation(x) || error(`${x} is not a continuation`);;

// Assert x is "fn" form
const assertFn: (x: any) => asserts x is Fn = (x) => (
  x instanceof Array && x[0] === "fn" && x.length === 3 &&
  x[1] instanceof Array && x[1].every(a => typeof a === "string")
) || error(`${x} is not a fn form or malformed`);

// Assert x is "try" form
const assertTry: (x: any) => asserts x is Try = (x) => (
  x instanceof Array && x[0] === "try" &&
  x[2] instanceof Array && typeof x[2][1] === "string" && x[2].length >= 3
) || error(`${x} is not a try form or malformed`);

// Assert x is "let" form
const assertLet: (x: any) => asserts x is Let = (x) => (
  x instanceof Array && x[0] === "let" &&
  x[1] instanceof Array && x.length >= 3
) || error(`${x} is not a let form or malformed`);

// Assert x is "dynamic-let" form
const assertDynamicLet: (x: any) => asserts x is DynamicLet = (x) => (
  x instanceof Array && x[0] === "dynamic-let" &&
  x[1] instanceof Array && x.length >= 3
) || error(`${x} is not a let form or malformed`);

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
export const findEnv = (env: Env, base: Base | null, symbol: string): [Expr, boolean, boolean] => {
  for (let e: Env | null = env; !!e; e = e[1]) {
    if (e[0].hasOwnProperty(symbol)) {
      return [e[0][symbol], true, false];
    } else if (
      !e[1] && base && symbol in base && base[symbol] !== null &&
      (typeof base[symbol] === "object" || typeof base[symbol] === "function")
    ) {
      const bor: BOR = { bor: symbol }; // Create BOR here.
      return [bor, true, true];
    }
  }
  return [null, false, false];
};

// Get root of env (except base)
const getEnvRoot = (e: Env): Env => e[1] ? getEnvRoot(e[1]) : e;

// -------------------------------------------------------
//               Interpreter class
// -------------------------------------------------------

export class Interpreter {
  private stackMax: number = Infinity; // Stack size. Throws error when exceeds.
  /* eslint-disable-next-line no-use-before-define */
  private base: Base = DEFAULT_BASE; // upper of root environment.
  private env: Env = [{}, null]; // environment root (except base).
  private dynamicEnv: Env = [{}, null]; // dynamic environment root
  private loadCore: boolean = true; // load core on construct or not.

  // for debugging
  public debugCount: number = 0; // Counts how may times debug message shown.
  public debugMode: boolean = false; // Show debug messsage if true.except loading core.
  public debugCore: boolean = false; // Show debug messsage if true on loading core.
  public debugMax: number = Infinity; // Throws error if debugCount exceeds this.
  public debugFilter: (message: string) => boolean = () => true;

  // Constructor can take options.
  // Load core.json to the Base object unless disabled.
  constructor(options?: Options) {
    deleteUndefined(options); // Don't give any undefined value to the options.
    Object.assign(this, options);
    if (this.loadCore) {
      const debugMode = this.debugMode;
      this.debugMode = this.debugCore;
      this.evalInBase(require("./core.json"));
      this.debugMode = debugMode;
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
  private evalAST = (ast: Expr, env = this.env, dynamicEnv = this.dynamicEnv): Expr | Promise<Expr> => {

    // Root container contains the given AST.
    // This enables replacement of the value even for scalar value.
    const root = [ast];

    // Evaluation stack contains evaluation requests with environment.
    // The initial value includes the root container above.
    const stack: EvalStack = [{ parent: root, index: 0, env, dynamicEnv, flag: null, handler: null }];

    // A utility function the push evaluation requests on the stack.
    // The evaluation will be done in the given order.
    // Throws an exception if the given items + stacked items exceeds QUEUE_MAX.
    const pushEvalStack = (ev: Eval): Eval => (stack.length >= this.stackMax)
      ? error("Stack overflow") : (stack.push(ev), ev);

    // Continue evaluation until the stack becomes empty.
    while (stack.length) {
      this.debug("Current eval-stack length, eval-stack: ", stack.length, stack);
      const current = stack.pop()!;
      const { parent, index, env, dynamicEnv, flag, handler } = current;
      const node: Expr = parent[index];
      this.debug("Next evaluating AST node, env, dynamicEnv, flag: ", node, env, dynamicEnv, flag);

      try {
        if (typeof node === "string") {
          // Symbol - Look up it from the environment.
          const [v, found] = findEnv(env, this.base, node);
          parent[index] = found ? v : error(`${node} not found`);

        } else if (isList(node)) {
          // Form - Apply it.

          // Select form handler.
          // If the car is symbol, get the value from the environment
          // to determine if this is a macro / half macro form or coninuation form.
          const envv = (typeof node[0] === "string") ? this.derefBOR(findEnv(env, this.base, node[0])[0]) : null;
          const formHandler = isMacro(envv) ? (
            MacroHandler
          ) : (isHalfMacro(envv) || (isHalfMacro(this.derefBOR(node[0])) && !!flag)) ? (
            HalfMacroHandler
          ) : (typeof node[0] === "string" && SpecialFormHandlers.hasOwnProperty(node[0])) ? (
            SpecialFormHandlers[node[0]]
          ) : (isContinuation(node[0]) || isContinuation(envv)) ? (
            ContinuationFormHandler
          ) : StandardFormHandler;

          // Apply the selected form handler.
          const { ret, subevals, reevals } = formHandler({
            node, env, base: this.base, dynamicEnv, flag, handler,
            cont: { current, stack, lang: LANGUAGE, version: VERSION, info: null },
            interpreter: this,
          });

          // Push on evaluattion stack and substitute the AST according to the return values.
          reevals?.reverse().forEach(ev => pushEvalStack({
            parent: ev.parent ?? parent,
            index: ev.index ?? index,
            env: ev.env ?? env,
            dynamicEnv: ev.dynamicEnv ?? dynamicEnv,
            flag: ev.flag ?? null,
            handler: ev.handler ?? handler
          }));
          subevals?.reverse().forEach(ev => ev && pushEvalStack({
            parent: ev.parent ?? parent,
            index: ev.index ?? index,
            env: ev.env ?? env,
            dynamicEnv: ev.dynamicEnv ?? dynamicEnv,
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
          this.debug("Suspend. Continuation: ", e);
          throw e;
        } else if (e instanceof ContinuablePromise) {
          // Thrown ContinuablePromise does not be caught by try-catch too.
          this.debug("Suspend. ContinuablePomise: ", e);
          throw e;
        } else {
          // Exception.
          this.debug("Caught an exception. Exception: ", e);
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
        this.debug("Evaluation Done. Node, env, dynamicEnv: ", parent[index], env, dynamicEnv);
      }
    }

    // Return the evaluated value in the container at last.
    this.debug("Evaluatin finished. Result: ", root[0]);
    return root[0];
  }

  // Evaluate AST ( as public method )
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

  // Resume with a continuation and parameter.
  // Note: parameter can be null.
  public resume = (cont: Continuation, value: Expr) => {
    return this.evalAST(["resume", cont, value]);
  }

  // Evaluate AST with Base environment.
  // Base environment will not be included in continuation data.
  // Used for loading core.json.
  public evalInBase = (ast: Expr) => {
    this.evalAST(ast, [this.base, null]);
  }

  // Dereference if the given argument is a BOR.
  public derefBOR = (ast: Expr) => isBOR(this.base, ast) ? this.base[ast.bor] : ast;

  // Wrap given lambda with JS function.
  // Internally used when calling JS function.
  public wrapLambda = (ast: readonly Expr[]) => isLambda(ast)
    ? (...a: Expr[]) => this.evalAST([["`", ast], ...a])
    : ast;

  // This method can treat ["await", <a Promise/PromiseLike>] as if Javascript's "await"
  // function. Returns a Promise(or a PromiseLike) that resolves with the final
  // evaluated value of the given expression.
  public evalAsync = (expr: Expr): PromiseLike<Expr> => {
    return new Promise((resolve, reject) => {
      // evaluates expr or Continuous promise recursively.
      // Note: promise must be fulfilled when calling func().
      const func = (exprOrPromise: Expr | ContinuablePromise) => {
        try {
          if (exprOrPromise instanceof ContinuablePromise) {
            resolve(exprOrPromise.resume());
          } else {
            resolve(this.eval(exprOrPromise));
          }
        } catch (e) {
          if (e instanceof ContinuablePromise) {
            e.then(()=>func(e), (err)=>reject(err));
          } else {
            reject(e);
          }
        }
      }

      // Call the func above.
      func(expr);
    });
  }
}

// -------------------------------------------------------
//                Form handlers
// -------------------------------------------------------

// Standard form
const StandardFormHandler: FormHandler = ({ node, env, dynamicEnv, base, flag, interpreter }) => {
  const f = interpreter.derefBOR(node[0]);
  if (!flag && !isApplicable(f)) {
    const cn = [...node];
    return {
      ret: cn,
      reevals: [{ flag: "!" }],
      subevals: cn.map((v, index) => ({ parent: cn, index, env })),
    };
  } else {
    const [, ...args] = node;
    // Apply function.
    if (isJSFunction(f)) {
      try {
        return { ret: f(...args.map(a => interpreter.wrapLambda(interpreter.derefBOR(a)))) };
      } catch (e) {
        if (isContinuation(e)) {
          throw "Javascript function can not throw any continuation."
        }
        throw e;
      }
    } else if (isLambda(f)) {
      const [, params, body, e] = f;
      if (typeof body === "function") {
        // JS lambda.
        // Note: Unlike JS functions, JS lambda receive arguments via environemnt.
        try {
          const jsLambdaFunc = body as JSLambdaFunction;
          return { ret: jsLambdaFunc(new EnvWrapper(newEnv(e!, params, args), dynamicEnv, env, base), interpreter) };
        } catch (e) {
          if (isContinuation(e)) {
            throw "Javascript function can not throw any continuation."
          }
          throw e;
        }
      } else {
        // Lisp lambda. create a new environment with arguments mapped to parameters
        // then evaluate the body.
        return { ret: body, reevals: [{ env: newEnv(e!, params!, args)}] };
      }
    } else {
      throw `${String(f)} is not applicable`;
    }
  }
}

// Macro form
// Note: Differences macros and non-special functions are
//   1. Macros don't evaluate the arguments.
//   2. Macros request re-evaluation of the results.
//   3. Macros can be applied only by symbols.
//   4. (Undocumented feature): can wrap special functions like fn/def/etc
const MacroHandler: FormHandler = ({ node, env, base, interpreter }) => {
  assertSymbol(node[0]);
  const v = interpreter.derefBOR(findEnv(env, base, node[0])[0]);
  assertMacro(v);
  // Apply the applicable and re-evaluate after that ( = 2 reevals )
  return { ret: [v[1], ...node.slice(1)], reevals: [{ flag: "!" }, { flag: null }] };
}

// Half macro form
// Half macros are like macros, but auguments are evaluated before applying macro function.
const HalfMacroHandler: FormHandler = ({ node, env, base, flag, interpreter }) => {
  if (!flag) {
    // Request subevaluation.
    // Note: we must keep BOR while subevaluation.
    assertSymbol(node[0]);
    const v = interpreter.derefBOR(findEnv(env, base, node[0])[0]);
    assertHalfMacro(v);
    const cn = [...node];
    return {
      ret: cn,
      subevals: cn.map((v, index) => ({ parent: cn, index })),
      reevals: [{ flag: "!" }]
    };
  } else {
    // Apply the applicable and re-evaluate after that ( = 2 reevals )
    const v = interpreter.derefBOR(node[0]);
    assertHalfMacro(v);
    return { ret: [v[1], ...node.slice(1)], reevals: [{ flag: "!" }, { flag: null }] };
  }
}

// Continuation form
const ContinuationFormHandler: FormHandler = ({ node, flag, cont }) => {
  const [f] = node;
  if (!flag && !isApplicable(f)) {
    // Evaluate the argument. (In the current environment, Not in the continuation's one)
    const cn = [...node];
    return {
      ret: cn,
      reevals: [{ flag: "!" }],
      subevals: cn.map((v, index) => ({ parent: cn, index })),
    };
  } else {
    // Mount the continuation on the current AST, stack, and handlers.
    const [, ...args] = node;
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
  eval: ({ node, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      return { ret: node[1], reevals: [{ flag: null }] };
    }
  },

  // def - define
  def: ({ node, env, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 2 }] };
    } else {
      const [, symbol, v = null] = node;
      assertSymbol(symbol);
      return { ret: setEnv(env, symbol, v) };
    }
  },

  // defdynamic - define dynamic variable
  defdynamic: ({ node, dynamicEnv, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 2 }] };
    } else {
      const [, symbol, v = null] = node;
      assertSymbol(symbol);
      setEnv(getEnvRoot(dynamicEnv), symbol, v);
      return { ret: v };
    }
  },

  // ~ - define macro
  "~": ({ node, flag }) => {
    const cn = [...node];
    if (!flag) {
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      // Check if the evaluated value is applicable.
      assertApplicable(cn[1]);
      return { ret: cn };
    }
  },

  // ~~ - define half macro
  "~~": ({ node, flag }) => {
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
  ".-": ({ node, base, flag, interpreter }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = interpreter.derefBOR(node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't read/set property of null or undefined.";
      }
      const [, , prop, v] = node.map(a => interpreter.derefBOR(a));
      assertPropertyIndex(prop);
      return { ret: node.length === 3 ? o[prop] : o[prop] = v };
    }
  },

  // . - call/apply method
  ".": ({ node, base, flag, interpreter }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = interpreter.derefBOR(node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't call method of null or undefined.";
      }
      const [, , prop, ...args] = node;
      assertPropertyIndex(prop);
      if (typeof o[prop] === "function") {
        try {
          return { ret: o[prop].apply(o, args.map(a => interpreter.wrapLambda(interpreter.derefBOR(a)))) };
        } catch (e) {
          if (isContinuation(e)) {
            throw "Javascript methods can not throw any continuation."
          }
          throw e;
        }
      } else {
        assertApplicable(o[prop]);
        return { ret: [o[prop], ...args], reevals: [{ flag: "!" }] };
      }
    }
  },

  // oget - get attribute/property, not dereferencing argument's BOR.
  // Note: maybe JSLambda can do this.
  oget: ({ node, base, flag, interpreter }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = interpreter.derefBOR(node[1]) as any;
      if (o === null || o === undefined) {
        throw "Can't read property of null or undefined.";
      }
      const [, , prop] = node;
      assertPropertyIndex(prop);
      return { ret: o[prop] };
    }
  },

  // oset - set attribute/property, not dereferencing argument's BOR.
  // Note: maybe JSLambda can do this.
  oset: ({ node, base, flag, interpreter }) => {
    if (!flag) {
      const cn = [...node];
      return {
        ret: cn,
        reevals: [{ flag: "!" }],
        subevals: cn.map((v, index) => index >= 1 && { parent: cn, index }),
      };
    } else {
      const o = interpreter.derefBOR(node[1]) as any;
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
  try: ({ node, env, dynamicEnv, flag, cont, handler }) => {
    assertTry(node);
    if (!flag) {
      const newErrorHandler: Eval = {
        parent: cont.current.parent,
        index: cont.current.index,
        env: newEnv(env, [], []), // catch-clause runs on new env.
        dynamicEnv,
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
  fn: ({ node, env }) => {
    assertFn(node);
    // defining lambda ( List lambda or JS lambda)
    const [, params, body] = node;
    return { ret: ["=>", params, body, env] };
  },

  // map - apply function/lambda to each items in a list
  // Note: Maybe can be implimented by macro.
  map: ({ node, flag }) => {
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
  apply: ({ node, flag }) => {
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
  let: ({ node, env }) => {
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

  // dynamic-let - new dynamic environment with bindings
  "dynamic-let": ({ node, dynamicEnv, flag }) => {
    assertDynamicLet(node);
    if (!flag) {
      const [f, plist, body] = node;
      const cplist = [...plist];
      return {
        ret: [f, cplist, body],
        subevals: cplist.map((v, i) => i).filter(i => (i % 2) === 1).map(i => ({parent: cplist, index: i})),
        reevals: [{flag: "!"}],
      };
    } else {
      const [, plist, body] = node;
      if (plist.length % 2 === 1) {
        plist.push(null);
      }
      const ppairs = plist.reduce<[Expr, Expr][]>(
        (acc, v, i) => i % 2 ? acc : acc.concat([[plist[i], plist[i + 1]]]),
        []
      );
      const nenv = newEnv(dynamicEnv, [],[]);
      ppairs.forEach(([k, v]) => setEnv(nenv, String(k), v));
      return {
        ret: body,
        reevals: [{ dynamicEnv: nenv }],
      };
    }
  },

  // do - multiple forms (for side-effects)
  // Note: `do' MUST dispose the result of evalation except the last one.
  // Note: last one substitutes the `do' form and re-evaluated not increasing stack.
  do: ({ node }) => {
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
  if: ({ node, flag }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      return { ret: node[1] ? node[2] : node[3], reevals: [{ flag: null }] };
    }
  },

  // suspend - throws continuation.
  suspend: ({ node, flag, cont }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      const [, ...args] = node;
      cont.info = args[0] ?? null;
      throw cont;
    }
  },

  // resume - resume the continuation.
  // Note: Can be implemented by macro.
  resume: ({ node, flag }) => {
    const [, cont, ...args] = node;
    assertContinuation(cont);
    return { ret: [cont, ...args], reevals: [{ flag: "!" }] }
  },
  // Note: maybe we can implement a call/cc here.

  // dynamic - Look up and get value of dynamic variable.
  // Note: we don't have "setf" yet.
  dynamic: ({ node, dynamicEnv }) => {
    const [, name] = node;
    assertSymbol(name);
    const [v, found] = findEnv(dynamicEnv, null, name);
    return { ret: found ? v : error(`dynamic variable ${name} not found`) };
  },

  // await - throws ContinuablePromise.
  await: ({ node, flag, cont, interpreter }) => {
    if (!flag) {
      const cn = [...node];
      return { ret: cn, reevals: [{ flag: "!" }], subevals: [{ parent: cn, index: 1 }] };
    } else {
      const [, ...args] = node;
      throw new ContinuablePromise(
        interpreter,
        (args.length === 0) ? null : (args.length === 1) ? args[0] : Promise.all(args),
        cont
      );
    }
  },

};

// -------------------------------------------------------
//                Environment wrapper
// -------------------------------------------------------

// This class wraps environment (with base object) and provides get/has/set method.
// Used for passing environment information to JS lambdas.
export class EnvWrapper {
  private env: Env;
  private dynamicEnv: Env;
  private callerEnv: Env;
  private base: Base;
  constructor(env: Env, dynamicEnv: Env, callerEnv: Env, base: Base) {
    this.env = env;
    this.dynamicEnv = dynamicEnv;
    this.callerEnv = callerEnv;
    this.base = base;
  }
  get = (name: string) => findEnv(this.env, this.base, name)[0];
  has = (name: string) => findEnv(this.env, this.base, name)[1];
  set = (name: string, value: Expr) => setEnv(this.env, name, value);
  dynamicGet = (name: string) => findEnv(this.dynamicEnv, null, name)[0];
  dynamicHas = (name: string) => findEnv(this.dynamicEnv, null, name)[1];
  dynamicSet = (name: string, value: Expr) => setEnv(getEnvRoot(this.dynamicEnv), name, value);
  dynamicSetLocal = (name: string, value: Expr) => setEnv(this.dynamicEnv, name, value);
  callerGet = (name: string) => findEnv(this.callerEnv, this.base, name)[0];
  callerHas = (name: string) => findEnv(this.callerEnv, this.base, name)[1];
}

// This class wraps a promise and a continuation given to "await" function
// to enable to resume evaluation when the promise have been resolved.
// If a value is given instead of a promise, it is treated as a resolved value.
// This class also provides some utility functions to inspect the status
// syncronously just like BlueBird does.
// Note: We can't extend Promise class using Typescript. A workaround that is suggested
// on the link blow is having a internal promise and proxy it. We also do that.
// https://github.com/microsoft/TypeScript/issues/15202
export class ContinuablePromise implements PromiseLike<void> {
  private interpreter: Interpreter;
  private coninuation: Continuation;
  private resolvedValue?: Expr;
  private rejectedReason: any;
  private status: "fulfilled" | "rejected" | "pending" = "pending";
  private resolve!: (value?: void | PromiseLike<void>) => void;
  private reject!: (reason?: any) => void;
  private promise: Promise<void>; // Internal promise.

  constructor(interpreter: Interpreter, promise: any, continuation: Continuation) {
    this.promise = new Promise<void>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    });
    this.interpreter = interpreter;
    this.coninuation = continuation;
    if (isPromiseLike<Expr, any>(promise)) {
      promise.then(
        (value) => {
          this.resolvedValue = value;
          this.status = "fulfilled";
          this.resolve();
        },
        (reason) => {
          this.rejectedReason = reason;
          this.status = "rejected";
          this.reject(reason);
        },
      );
    } else {
      this.resolvedValue = promise;
      this.status = "fulfilled";
      this.resolve();
    }
  }

  // Utility functions to inspect status.
  isFulfilled() {
    return this.status === "fulfilled";
  }
  isRejected() {
    return this.status === "rejected";
  }
  isPending() {
    return this.status === "pending";
  }
  reason() {
    if (!this.isRejected()) {
      throw new Error("The promise is not rejected yet.");
    }
    return this.rejectedReason;
  }

  // Resumes evaluation.
  // Note that this method can be called after the promise was fulfilled(resolved).
  // Otherwise this method throws an error.
  resume() {
    if (!this.isFulfilled()) {
      throw new Error("The promise is not fulfilled yet.");
    }
    return this.interpreter.resume(this.coninuation, this.resolvedValue);
  }


  public then<TResult1 = void, TResult2 = never>(
    onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  catch(onRejected?: (reason: any) => PromiseLike<never>): Promise<void> {
    return this.promise.catch(onRejected)
  }
}

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
});

export default Interpreter;
