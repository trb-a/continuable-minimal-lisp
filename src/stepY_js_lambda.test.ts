import Interpreter, { isContinuation } from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("Directly create and apply JS Lambda", () => {
  expect(interpreter.eval([["fn", ()=>{ return 42; }]])).toBe(42);
});

test("Define and call JS Lambda", () => {
  interpreter.eval(["def", "jsl", ["fn", ()=>{ return 42; }]]);
  expect(interpreter.eval(["jsl"])).toBe(42);
});

test("JS Lambda receive raw BOR", () => {
  interpreter.eval(["def", "jsl2", ["fn", (a: any)=>{ return a; }]]);
  expect(interpreter.eval(["jsl2", "Date"])).toEqual({bor: "Date"});
});

test("Define JS Lambda macro", () => {
  interpreter.eval(["def", "jslm", ["~", ["fn", (a: any)=>{ return ["+", 40, a]; }]]]);
  expect(interpreter.eval(["jslm", 2])).toBe(42);
});

test("JS Labmda macro receive raw BOR", () => {
  interpreter.eval(["def", "jslm", ["~", ["fn", (a: any)=>{ return ["`", a]; }]]]);
  expect(interpreter.eval(["jslm", {"bor": "Date"}])).toEqual({bor: "Date"});
});
