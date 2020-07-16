// From https://github.com/kanaka/miniMAL, under test directory
// Converted to jest syntax.

import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;



test("Half-macro.", () => {
  expect(interpreter.eval(
    ["do",
      ["def", "hm-times10-*-c", ["~~", ["fn", ["a"], (env) => {
        const times10 = env.get("a") * 10; // "a" have been evaluated in the caller's env.
        return ["*", times10, "c"]; // this form will be evaluated in the caller's env.
      }]]],
      ["def", "b", 7],
      ["def", "c", 5],
      ["hm-times10-*-c", "b"],
    ]
  )).toBe(7 * 10 * 5);
});


