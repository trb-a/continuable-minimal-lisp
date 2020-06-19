/// <reference types="node" />
declare module "interpreter" {
    export const LANGUAGE = "Continuable-miniMAL-Lisp";
    export const VERSION = "0.0.1";
    type Expr = Expr[] | bigint | boolean | ((...args: any[]) => any) | number | object | string | symbol | undefined | null;
    type Env = [Record<string, Expr>, Env | null];
    type Base = {
        [x: string]: any;
    };
    export type BOR = {
        bor: string;
    };
    export type Lambda = ["=>", string[], Expr, Env] | ["=>", JSFunction];
    type JSFunction = (...args: any[]) => any;
    export type Continuation = {
        current: Eval;
        stack: EvalStack;
        info?: Expr;
        lang: string;
        version: string;
    };
    type Applicable = Lambda | JSFunction | Continuation;
    export type Eval = {
        parent: Expr[];
        index: number;
        env: Env;
        flag: string | null;
        handler: Eval | null;
    };
    export type EvalStack = Eval[];
    export type Options = {
        stackMax?: number;
        base?: Base;
        env?: Env;
        loadCore?: boolean;
        debugMode?: boolean;
        debugMax?: number;
        debugFilter?: (message: string) => boolean;
    };
    export const cloneAST: (ast: any, map?: Map<any, any>) => Expr;
    export const isBOR: (base: Base, x: any) => x is BOR;
    export const isEnv: (x: any) => x is Env;
    export const isLambda: (x: any) => x is Lambda;
    export const isApplicable: (x: any) => x is Applicable;
    export const isContinuation: (x: any) => x is Continuation;
    export const newBOR: (base: Base, prop: string) => BOR;
    export const derefBOR: (base: Base, ast: Expr) => any;
    export const newEnv: (upper: Env, symbols: string[], values: Expr[], variadic?: boolean) => Env;
    export const setEnv: <T extends Expr>(env: Env, symbol: string, value: T) => T;
    export const findEnv: (env: Env, base: Base, symbol: string) => [Expr, boolean, boolean];
    export class Interpreter {
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
        eval: (ast: Expr) => string | number | bigint | boolean | symbol | object | Expr[] | ((...args: any[]) => any) | Promise<Expr>;
        rep: (input: string) => string;
        evalInBase: (ast: Expr) => void;
    }
    export const TheGlobal: typeof globalThis | (NodeJS.Global & typeof globalThis);
    export default Interpreter;
}
declare module "index" {
    export * from "interpreter";
}
