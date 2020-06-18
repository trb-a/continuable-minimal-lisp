// sum.test.js
import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

// eslint-disable-next-line
const TheGlobal = globalThis || window || global || this;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("new Interpreter creates interpreter.", () => {
  expect(new Interpreter()).toBeInstanceOf(Interpreter);
});

test("1", () => {
  expect(interpreter.eval(["+", 2, 3])).toBe(5);
});

test("2", () => {
  expect(interpreter.eval(["if", ["=", 5, 5], 7, 8])).toBe(7);
});

test("3", () => {
  expect(interpreter.eval(["+", 2, ["*", 3, 4]])).toBe(14);
});

test("4", () => {
  expect(interpreter.eval(["def", "a_symbol", 3])).toBe(3);
});

test("5", () => {
  expect(interpreter.eval("a_symbol")).toBe(3);
});

test("6", () => {
  expect(interpreter.eval(["*", "a_symbol", 6])).toBe(18);
});

test("7", () => {
  expect(interpreter.eval(["`", "a quoted symbol is a string"])).toBe(
    "a quoted symbol is a string"
  );
});

test("8", () => {
  expect(interpreter.eval([["fn", ["a"], ["*", "a", "a"]], 8])).toBe(64);
});

test("9", () => {
  interpreter.eval(["def", "sqr", ["fn", ["a"], ["*", "a", "a"]]]);
  expect(interpreter.eval(["sqr", 7])).toBe(49);
});

test("10", () => {
  interpreter.eval(["def", "drop1", ["fn", ["a", "&", "b"], "b"]]);
  expect(interpreter.eval(["drop1", 1, 2, 3])).toEqual([2, 3]);
});

test("11", () => {
  interpreter.eval([
    "def",
    "add5",
    ["let", ["x", 5], ["fn", ["a"], ["+", "x", "a"]]]
  ]);
  expect(interpreter.eval(["add5", 7])).toBe(12);
});

test("12", () => {
  expect(() => interpreter.eval("x")).toThrow(/x not found/);
});

test("13", () => {
  interpreter.eval([
    "def",
    "addX",
    ["fn", ["X"], ["fn", ["a"], ["+", "X", "a"]]]
  ]);
  interpreter.eval(["def", "add9", ["addX", 9]]);
  expect(interpreter.eval(["add9", 20])).toBe(29);
});

test("14", () => {
  expect(interpreter.eval(["do", ["map", "add9", ["`", [2, 3, 4]]]])).toEqual([
    11,
    12,
    13
  ]);
});

test("15", () => {
  interpreter.eval([
    "def",
    "sum1",
    [
      // const sum1 = (n) => (n === 0) ? 0 : n + sum1( n - 1);
      "fn",
      ["n"],
      ["if", ["=", "n", 0], 0, ["+", "n", ["sum1", ["-", "n", 1]]]]
    ]
  ]);
  expect(() => interpreter.eval(["sum1", 100])).toThrow(/Stack overflow/);
});

test("16", () => {
  interpreter.eval([
    "def",
    "sum2",
    [
      "fn",
      ["n", "a"],
      ["if", ["=", "n", 0], "a", ["sum2", ["-", "n", 1], ["+", "n", "a"]]]
    ]
  ]);
  expect(interpreter.eval(["sum2", 100, 0])).toBe((100 + 1) * (100 / 2));
});

test("17", () => {
  interpreter.eval([
    "def",
    "randInt",
    ["fn", ["max"], ["parseInt", ["*", "max", [".", "Math", ["`", "random"]]]]]
  ]);
  expect(interpreter.eval(["randInt", 100])).toBeLessThanOrEqual(100);
});

test("18", () => {
  interpreter.eval([
    "def",
    "set-style",
    ["fn", ["o", "k", "v"], [".-", [".-", "o", ["`", "style"]], "k", "v"]]
  ]);
  interpreter.eval([
    "def",
    "by-tag",
    ["fn", ["tag"], [".", "document", ["`", "getElementsByTagName"], "tag"]]
  ]);
  expect(
    interpreter.eval([
      "set-style",
      [".-", ["by-tag", ["`", "body"]], 0],
      ["`", "backgroundColor"],
      ["`", "rgb(140, 150, 160)"]
    ])
  ).toBe(TheGlobal.document.body.style.backgroundColor);
});

test("19", () => {
  expect(
    interpreter.eval([
      "try",
      "abc",
      ["catch", "exc", ["list", ["`", "exc was:"], "exc"]]
    ])
  ).toEqual(["exc was:", "abc not found"]);
});

test("20", () => {
  expect(
    interpreter.eval([
      "try",
      ["throw", 123],
      ["catch", "exc", ["list", ["`", "exc was:"], "exc"]]
    ])
  ).toEqual(["exc was:", 123]);
});

// The same as 20??
test("21", () => {
  expect(
    interpreter.eval([
      "try",
      ["throw", 123],
      ["catch", "exc", ["list", ["`", "exc was:"], "exc"]]
    ])
  ).toEqual(["exc was:", 123]);
});

test("22", () => {
  interpreter.eval([
    "def",
    "unless",
    ["~", ["fn", ["p", "a", "b"], ["list", ["`", "if"], "p", "b", "a"]]]
  ]);
  expect(interpreter.eval(["unless", false, 7, 8])).toBe(7);
});

test("23", () => {
  expect(interpreter.eval(["do", ["unless", true, 7, 8]])).toBe(8);
});
