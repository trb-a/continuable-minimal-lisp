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

// Testing read of null/true/false
test("1", () => {
  expect(interpreter.rep("null")).toBe("null");
});
test("2", () => {
  expect(interpreter.rep("true")).toBe("true");
});
test("3", () => {
  expect(interpreter.rep("false")).toBe("false");
});

// Testing read of numbers
test("4", () => {
  expect(interpreter.rep("1")).toBe("1");
});
test("5", () => {
  expect(interpreter.rep("7")).toBe("7");
});
test("6", () => {
  expect(interpreter.rep("  7   ")).toBe("7");
});

// We skip those tests blow. They are only for read/write,
// Not for rep.

// Testing read of strings
test.skip("7", () => {
  expect(interpreter.rep('"abc"')).toBe('"abc"');
});
test.skip("8", () => {
  expect(interpreter.rep('   "abc"   ')).toBe('"abc"');
});
test.skip("9", () => {
  expect(interpreter.rep('"abc (with parens)"')).toBe('"abc (with parens)"');
});
test.skip("10", () => {
  expect(interpreter.rep('"abc"def"')).toBe('"abc"def"');
});
//;"abc\ndef"
//;;=>"abc\ndef"
test.skip("11", () => {
  expect(interpreter.rep('""')).toBe('""');
});

// Testing read of lists
test.skip("12", () => {
  expect(interpreter.rep('["+", 1, 2]')).toBe('["+",1,2]');
});
test.skip("13", () => {
  expect(interpreter.rep("[[3, 4]]")).toBe("[[3,4]]");
});
test.skip("14", () => {
  expect(interpreter.rep('["+", 1, ["+", 2, 3]]')).toBe('["+",1,["+",2,3]]');
});
test.skip("15", () => {
  expect(interpreter.rep('  [ "+" ,   1 ,   ["+",   2, 3   ]   ]  ')).toBe(
    '["+",1,["+",2,3]]'
  );
});

// Testing read of hash maps
test.skip("16", () => {
  expect(interpreter.rep('[{"abc": 1}]')).toBe('[{"abc":1}]');
});
test.skip("17", () => {
  expect(interpreter.rep('[{"a": {"b": 2}}]')).toBe('[{"a":{"b":2}}]');
});
test.skip("18", () => {
  expect(interpreter.rep('[{"a": {"b": {"c": 3}}}]')).toBe(
    '[{"a":{"b":{"c":3}}}]'
  );
});
test.skip("19", () => {
  expect(interpreter.rep('[{  "a"  :  {"b":   {  "cde" :     3   }  }}]')).toBe(
    '[{"a":{"b":{"cde":3}}}]'
  );
});

//;;;
//;;; Testing reader errors
//;;;; TODO: fix these so they fail correctly
//;[1, 2
//;; Unexpected end of input
//;[1, 2,
//;; Unexpected end of input
//;"abc
//;; Unexpected end of input
