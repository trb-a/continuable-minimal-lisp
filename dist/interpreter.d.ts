export declare const LANGUAGE = "Continuable-miniMAL-Lisp";
export declare const VERSION = "0.2.1";
declare type Expr = Expr[] | bigint | boolean | ((...args: any[]) => any) | number | object | string | symbol | undefined | null;
declare type Env = [Record<string, Expr>, Env | null];
declare type Base = {
    [x: string]: any;
};
export declare type BOR = {
    bor: string;
};
export declare type Lambda = ["=>", string[], Expr, Env];
declare type JSFunction = (...args: any[]) => any;
export declare type Continuation = {
    current: Eval;
    stack: EvalStack;
    info?: Expr;
    lang: string;
    version: string;
};
declare type Applicable = Lambda | JSFunction | Continuation;
export declare type Eval = {
    parent: Expr[];
    index: number;
    env: Env;
    flag: string | null;
    handler: Eval | null;
};
export declare type EvalStack = Eval[];
export declare type Options = {
    stackMax?: number;
    base?: Base;
    env?: Env;
    loadCore?: boolean;
    debugMode?: boolean;
    debugMax?: number;
    debugFilter?: (message: string) => boolean;
};
export declare const cloneAST: (ast: any, map?: Map<any, any>) => Expr;
export declare const isBOR: (base: Base, x: any) => x is BOR;
export declare const isEnv: (x: any) => x is Env;
export declare const isLambda: (x: any) => x is Lambda;
export declare const isApplicable: (x: any) => x is Applicable;
export declare const isContinuation: (x: any) => x is Continuation;
export declare const newEnv: (upper: Env, symbols: string[], values: Expr[], variadic?: boolean) => Env;
export declare const setEnv: <T extends Expr>(env: Env, symbol: string, value: T) => T;
export declare const findEnv: (env: Env, base: Base, symbol: string) => [Expr, boolean, boolean];
export declare class Interpreter {
    private stackMax;
    private base;
    private env;
    private loadCore;
    debugCount: number;
    debugMode: boolean;
    debugMax: number;
    debugFilter: (message: string) => boolean;
    constructor(options?: Options);
    private debug;
    private evalAST;
    eval: (ast: Expr) => string | number | bigint | boolean | symbol | object | Expr[] | ((...args: any[]) => any) | Promise<Expr> | null | undefined;
    rep: (input: string) => string | undefined;
    resume: (cont: Continuation, value: Expr) => string | number | bigint | boolean | symbol | object | Expr[] | ((...args: any[]) => any) | Promise<Expr> | null | undefined;
    evalInBase: (ast: Expr) => void;
    derefBOR: (ast: Expr) => any;
    wrapLambda: (ast: readonly Expr[]) => readonly Expr[] | ((...a: Expr[]) => string | number | bigint | boolean | symbol | object | Expr[] | ((...args: any[]) => any) | Promise<Expr> | null | undefined);
}
export declare const TheGlobal: typeof globalThis;
export default Interpreter;
