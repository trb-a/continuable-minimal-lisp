
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

// from tests directory.
test("1", () => {
  interpreter.eval(["def", "b", ["new", "Buffer", ["list", 7, 8, 9]]]);
  expect(interpreter.eval(["count", "b"])).toBe(3);
});
test("2", () => {
  expect(interpreter.eval(["get", "b", 1])).toEqual(8);
});
test("3", () => {
  expect(interpreter.eval(["def", "o", ["new", "Object"]])).toEqual({});
});

// We can't do his.
test.skip("4", () => {
  expect(interpreter.eval(["def", "f", ["new", ["fn", [], null]]])).toEqual({});
});

// Testing isa

// TODO: Jest may fail this. (maybe harmless for browsers)
test.skip("5", () => {
  expect(interpreter.eval(["isa", "b", "Object"])).toBe(true);
});

test("6", () => {
  expect(interpreter.eval(["isa", "b", "Buffer"])).toBe(true);
});

test("7", () => {
  expect(interpreter.eval(["isa", "b", "String"])).toBe(false);
});

// Testing type
test("8", () => {
  expect(interpreter.eval(["classOf", 123])).toBe("[object Number]");
});

test("9", () => {
  expect(interpreter.eval(["classOf", ["`", "123"]])).toBe("[object String]");
});

test("10", () => {
  expect(interpreter.eval(["classOf", "b"])).toBe("[object Uint8Array]");
});

// Testing del
test("11", () => {
  interpreter.eval(["def", "o", { a: 7, b: 8 }]);
  expect(interpreter.eval(["get", "o", ["`", "a"]])).toBe(7);
});

test("12", () => {
  expect(interpreter.eval(["do", ["del", "o", ["`", "a"]], "o"])).toEqual({
    b: 8
  });
});
