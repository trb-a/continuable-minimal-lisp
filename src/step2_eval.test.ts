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

// Testing evaluation of arithmetic operations
test("1", () => {
  expect(interpreter.rep('["+", 1, 2]')).toBe("3");
});

test("2", () => {
  expect(interpreter.rep('["+", 5, ["*", 2, 3]]')).toBe("11");
});

test("3", () => {
  expect(interpreter.rep('["-", ["+", 5, ["*", 2, 3]], 3]')).toBe("8");
});

test("4", () => {
  expect(interpreter.rep('["/", ["-", ["+", 5, ["*", 2, 3]], 3], 4]')).toBe(
    "2"
  );
});

test("5", () => {
  expect(
    interpreter.rep('["/", ["-", ["+", 515, ["*", 222, 311]], 302], 27]')
  ).toBe("2565");
});

//;{"a": ["+", 7, 8]}
//;;=>{"a": 15}
//;
//;["abc", 1, 2, 3]
//;; .*\'abc\' not found.*
