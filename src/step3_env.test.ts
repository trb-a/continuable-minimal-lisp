// From https://github.com/kanaka/miniMAL, under test directory
// And converted to jest syntax.

import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

// Testing REPL_ENV
test("1", () => {
  expect(interpreter.rep('["+", 1, 2]')).toBe("3");
});
test("2", () => {
  expect(interpreter.rep('["/", ["-", ["+", 5, ["*", 2, 3]], 3], 4]')).toBe(
    "2"
  );
});

// Testing "def",
test("3", () => {
  expect(interpreter.rep('["def", "x", 3]')).toBe("3");
});
test("4", () => {
  expect(interpreter.rep('"x"')).toBe("3");
});
test("5", () => {
  expect(interpreter.rep('["def", "x", 4]')).toBe("4");
});
test("6", () => {
  expect(interpreter.rep('"x"')).toBe("4");
});
test("7", () => {
  expect(interpreter.rep('["def", "y", ["+", 1, 7]]')).toBe("8");
});
test("8", () => {
  expect(interpreter.rep('"y"')).toBe("8");
});

// Testing "let",
test("9", () => {
  expect(interpreter.rep('["let", ["z", 9], "z"]')).toBe("9");
});
test("10", () => {
  expect(interpreter.rep('["let", ["x", 9], "x"]')).toBe("9");
});
test("11", () => {
  expect(interpreter.rep('"x"')).toBe("4");
});
test("12", () => {
  expect(interpreter.rep('["let", ["z", ["+", 2, 3]], ["+", 1, "z"]]')).toBe(
    "6"
  );
});
test("13", () => {
  expect(
    interpreter.rep(
      '["let", ["p", ["+", 2, 3], "q", ["+", 2, "p"]], ["+", "p", "q"]]'
    )
  ).toBe("12");
});

// Testing outer environment
test("14", () => {
  expect(interpreter.rep('["def", "a", 4]')).toBe("4");
});
test("15", () => {
  expect(interpreter.rep('["let", ["q", 9], "q"]')).toBe("9");
});
test("16", () => {
  expect(interpreter.rep('["let", ["q", 9], "a"]')).toBe("4");
});
test("17", () => {
  expect(interpreter.rep('["let", ["z", 2], ["let", ["q", 9], "a"]]')).toBe(
    "4"
  );
});
