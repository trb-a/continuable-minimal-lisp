import Interpreter, { Fn } from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("Directly create and apply JS Lambda", () => {
  expect(interpreter.eval([["fn", [], ()=>{ return 42; }]])).toBe(42);
});

test("Define and call JS Lambda", () => {
  interpreter.eval(["def", "jsl", ["fn", [], ()=>{ return 42; }]]);
  expect(interpreter.eval(["jsl"])).toBe(42);
});

test("JS Lambda parameters 1st = environment wrapper.", () => {
  interpreter.eval(["def", "var", 10]);
  interpreter.eval(["def", "jsl", ["fn", [], (env, itrp)=>{ return env.get("var"); }]]);
  expect(interpreter.eval(["jsl"])).toBe(10);
  interpreter.eval(["def", "jsl", ["fn", [], (env, itrp)=>{ env.set("var", 20); return env.get("var"); }]]);
  expect(interpreter.eval(["jsl"])).toBe(20);
  interpreter.eval(["def", "jsl", ["fn", [], (env, itrp)=>{ return env.has("var");}]]);
  expect(interpreter.eval(["jsl"])).toBe(true);
  interpreter.eval(["def", "jsl", ["fn", [], (env, itrp)=>{ return env.get("novar");}]]);
  expect(interpreter.eval(["jsl"])).toBe(null);
  interpreter.eval(["def", "jsl", ["fn", [], (env, itrp)=>{ return env.has("novar");}]]);
  expect(interpreter.eval(["jsl"])).toBe(false);
  interpreter.eval(["def", "jsl", ["fn", ["a"], (env, itrp)=>{ return env.get("a");}]]);
  expect(interpreter.eval(["jsl", 200])).toBe(200);
});

test("JS Lambda parameters 2nd = interpreter", () => {
  interpreter.eval(["def", "jsl", ["fn", ["a"], (env, itrp)=>{ return itrp.derefBOR(env.get("a"));}]]);
  expect(interpreter.eval(["jsl", {bor: "Date"}])).toBe(Date);
});

test("JS Lambda receive raw BOR", () => {
  interpreter.eval(["def", "jsl2", ["fn", ["a"], (env, itrp)=>{ return env.get("a"); }]]);
  expect(interpreter.eval(["jsl2", "Date"])).toEqual({bor: "Date"});
});

test("Define JS Lambda macro", () => {
  interpreter.eval(["def", "jslm", ["~", ["fn", ["a"], (env)=>{ return ["+", 40, env.get("a")]; }]]]);
  expect(interpreter.eval(["jslm", 2])).toBe(42);
});

test("JS Labmda macro receive raw BOR", () => {
  interpreter.eval(["def", "jslm", ["~", ["fn", ["a"], (env)=>{ return ["`", env.get("a")]; }]]]);
  expect(interpreter.eval(["jslm", {"bor": "Date"}])).toEqual({bor: "Date"});
});
