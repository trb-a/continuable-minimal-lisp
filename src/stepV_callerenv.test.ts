import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("JS lambda functions can refer caller variables", () => {
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.callerHas("aaa")]]);
  expect(interpreter.eval(["let", ["aaa", 10], ["jsf"]])).toBe(true);
  expect(interpreter.eval(["jsf"])).toBe(false);
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.callerGet("aaa")]]);
  expect(interpreter.eval(["let", ["aaa", 100], ["jsf"]])).toBe(100);
  expect(interpreter.eval(["jsf"])).toBe(null);
});
