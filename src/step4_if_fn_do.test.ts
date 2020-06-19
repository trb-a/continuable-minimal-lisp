// From https://github.com/kanaka/miniMAL, under test directory
// Converted to jest syntax.

import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 500;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

// -----------------------------------------------------

// Testing "list", functions
test("x", () => {
  expect(interpreter.rep('["list"]')).toBe("[]");
});
test("x", () => {
  expect(interpreter.rep('["list", 1, 2, 3]')).toBe("[1,2,3]");
});

// Testing if form
test("x", () => {
  expect(interpreter.rep('["if", true, 7, 8]')).toBe("7");
});
test("x", () => {
  expect(interpreter.rep('["if", false, 7, 8]')).toBe("8");
});
test("x", () => {
  expect(interpreter.rep('["if", true, ["+", 1, 7], ["+", 1, 8]]')).toBe("8");
});
test("x", () => {
  expect(interpreter.rep('["if", false, ["+", 1, 7], ["+", 1, 8]]')).toBe("9");
});
test("x", () => {
  expect(interpreter.rep('["if", null, 7, 8]')).toBe("8");
});
test("x", () => {
  expect(interpreter.rep('["if", 0, 7, 8]')).toBe("8");
});
test("x", () => {
  expect(interpreter.rep('["if", ["list", 1], 7, 8]')).toBe("7");
});
test("x", () => {
  expect(interpreter.rep('["if", ["list", 1, 2, 3], 7, 8]')).toBe("7");
});
test("x", () => {
  expect(interpreter.rep('["=", ["list"], null]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["if", null, 8, 7]')).toBe("7");
});

// Testing basic conditionals
test("x", () => {
  expect(interpreter.rep('["=", 2, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", 1, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["=", 1, 2]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", 1, ["+", 1, 1]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", 2, ["+", 1, 1]]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["=", null, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", null, null]')).toBe("true");
});

test("x", () => {
  expect(interpreter.rep('["<", 2, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["<", 1, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["<", 1, 2]')).toBe("true");
});

// Testing equality
test("x", () => {
  expect(interpreter.rep('["=", 1, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["=", 0, 0]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["=", 1, 0]')).toBe("false");
});

//; Basic = is not recursive
//;["=", ["list"], ["list"]]
//;;=>true
//;["=", ["list", 1, 2], ["list", 1, 2]]
//;;=>true
//;["=", ["list", 1], ["list"]]
//;;=>false
//;["=", ["list"], ["list", 1]]
//;;=>false
//;["=", 0, ["list"]]
//;;=>false
//;["=", ["list"], 0]
//;;=>false

// Testing builtin and user defined functions
test("x", () => {
  expect(interpreter.rep('["+", 1, 2]')).toBe("3");
});
test("x", () => {
  expect(interpreter.rep('[ ["fn", ["a", "b"], ["+", "b", "a"]], 3, 4]')).toBe(
    "7"
  );
});
test("x", () => {
  expect(interpreter.rep('[ ["fn", [], 4] ]')).toBe("4");
});

test("x", () => {
  expect(
    interpreter.rep(
      '[ ["fn", ["f", "x"], ["f", "x"]], ["fn", ["a"], ["+", 1, "a"]], 7]'
    )
  ).toBe("8");
});

// Testing closures
test("x", () => {
  expect(
    interpreter.rep('[ [ ["fn", ["a"], ["fn", ["b"], ["+", "a", "b"]]], 5], 7]')
  ).toBe("12");
});

test("x", () => {
  interpreter.eval([
    "def",
    "gen-plus5",
    ["fn", [], ["fn", ["b"], ["+", 5, "b"]]]
  ]);
  interpreter.eval(["def", "plus5", ["gen-plus5"]]);
  expect(interpreter.rep('["plus5", 7]')).toBe("12");
});

test("x", () => {
  interpreter.eval([
    "def",
    "gen-plusX",
    ["fn", ["x"], ["fn", ["b"], ["+", "x", "b"]]]
  ]);
  interpreter.eval(["def", "plus7", ["gen-plusX", 7]]);
  expect(interpreter.rep('["plus7", 8]')).toBe("15");
});

//; See step7_interop for variable length arguments

//;;; Testing language defined not function
//;[not false]
//;;=>true
//;[not true]
//;;=>false
//;[not "a"]
//;;=>false
//;[not 0]
//;;=>false

// Testing basic do form

test("x", () => {
  expect(interpreter.rep('["do", ["def", "a", 6], 7, ["+", "a", 8]]')).toBe(
    "14"
  );
});
test("x", () => {
  expect(interpreter.rep('"a"')).toBe("6");
});

//
// See step7 tests for more in depth do form tests
//

// Testing recursive sumdown function
test("x", () => {
  interpreter.eval([
    "def",
    "sumdown",
    [
      "fn",
      ["N"],
      ["if", ["<", 0, "N"], ["+", "N", ["sumdown", ["-", "N", 1]]], 0]
    ]
  ]);
  expect(interpreter.rep('["sumdown", 1]')).toBe("1");
});
test("x", () => {
  expect(interpreter.rep('["sumdown", 2]')).toBe("3");
});
test("x", () => {
  expect(interpreter.rep('["sumdown", 6]')).toBe("21");
});

// Testing recursive fibonacci function
test("x", () => {
  interpreter.eval([
    "def",
    "fib",
    [
      "fn",
      ["N"],
      [
        "if",
        ["=", "N", 0],
        1,
        [
          "if",
          ["=", "N", 1],
          1,
          ["+", ["fib", ["-", "N", 1]], ["fib", ["-", "N", 2]]]
        ]
      ]
    ]
  ]);
  expect(interpreter.rep('["fib", 1]')).toBe("1");
});
test("x", () => {
  expect(interpreter.rep('["fib", 2]')).toBe("2");
});
test("x", () => {
  expect(interpreter.rep('["fib", 4]')).toBe("5");
});
test("x", () => {
  expect(interpreter.rep('["fib", 10]')).toBe("89");
});

//
// See step7 tests for string quoting tests
//
