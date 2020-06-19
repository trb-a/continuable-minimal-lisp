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

// Load core.json
// interpreter.eval(["load", ["`", "core.json"]]);

// Testing non-macro function
test("1", () => {
  expect(interpreter.rep('["not", ["=", 1, 1]]')).toBe("false");
});
//; This should fail if it is a macro
test("2", () => {
  expect(interpreter.rep('["not", ["=", 1, 2]]')).toBe("true");
});

// Testing trivial macros
test("3", () => {
  interpreter.eval(["def", "one", ["~", ["fn", [], 1]]]);
  expect(interpreter.rep('["one"]')).toBe("1");
});
test("4", () => {
  interpreter.eval(["def", "two", ["~", ["fn", [], 2]]]);
  expect(interpreter.rep('["two"]')).toBe("2");
});

// Testing unless macros
test("5", () => {
  interpreter.eval([
    "def",
    "unless",
    ["~", ["fn", ["pred", "a", "b"], ["list", ["`", "if"], "pred", "b", "a"]]]
  ]);
  expect(interpreter.rep('["unless", false, 7, 8]')).toBe("7");
});
test("6", () => {
  expect(interpreter.rep('["unless", true, 7, 8]')).toBe("8");
});
test("7", () => {
  interpreter.eval([
    "def",
    "unless2",
    [
      "~",
      [
        "fn",
        ["pred", "a", "b"],
        ["list", ["`", "if"], ["list", ["`", "not"], "pred"], "a", "b"]
      ]
    ]
  ]);
  expect(interpreter.rep('["unless2", false, 7, 8]')).toBe("7");
});
test("8", () => {
  expect(interpreter.rep('["unless2", true, 7, 8]')).toBe("8");
});

//;;; Testing macroexpand
//;["macroexpand", ["unless2", 2, 3, 4]]
//;;=>[if [not 2] 3 4]

// Testing nth, first and rest functions

test("9", () => {
  expect(interpreter.rep('["nth", ["`", [1]], 0]')).toBe("1");
});
test("10", () => {
  expect(interpreter.rep('["nth", ["`", [1, 2]], 1]')).toBe("2");
});
//;["def", "x", ["`", "x"]]
//;["def", "x", ["nth", ["`", [1, 2]], 2]]
//;"x"
//;;=>"x"

test("11", () => {
  expect(interpreter.rep('["first", ["`", []]]')).toBe("null");
});
test("12", () => {
  expect(interpreter.rep('["first", ["`", [6]]]')).toBe("6");
});
test("13", () => {
  expect(interpreter.rep('["first", ["`", [7, 8, 9]]]')).toBe("7");
});

test("14", () => {
  expect(interpreter.rep('["rest", ["`", []]]')).toBe("[]");
});
test("15", () => {
  expect(interpreter.rep('["rest", ["`", [6]]]')).toBe("[]");
});
test("16", () => {
  expect(interpreter.rep('["rest", ["`", [7, 8, 9]]]')).toBe("[8,9]");
});
test("17", () => {
  expect(interpreter.rep('["and"]')).toBe("true");
});
test("18", () => {
  expect(interpreter.rep('["and", 1]')).toBe("1");
});
test("19", () => {
  expect(interpreter.rep('["and", 1, 2]')).toBe("2");
});
test("20", () => {
  expect(interpreter.rep('["and", 1, 2, 3]')).toBe("3");
});
test("21", () => {
  expect(interpreter.rep('["and", 1, 2, 3, 4]')).toBe("4");
});
test("22", () => {
  expect(interpreter.rep('["and", 1, 2, 3, 4, false]')).toBe("false");
});
test("23", () => {
  expect(interpreter.rep('["and", 1, 2, 3, 4, false, 5]')).toBe("false");
});

// Testing or macro
test("24", () => {
  expect(interpreter.rep('["or"]')).toBe("null");
});
test("25", () => {
  expect(interpreter.rep('["or", 1]')).toBe("1");
});
test("26", () => {
  expect(interpreter.rep('["or", 1, 2, 3, 4]')).toBe("1");
});
test("27", () => {
  expect(interpreter.rep('["or", false, 2]')).toBe("2");
});
test("28", () => {
  expect(interpreter.rep('["or", false, null, 3]')).toBe("3");
});
test("29", () => {
  expect(interpreter.rep('["or", false, null, false, false, null, 4]')).toBe(
    "4"
  );
});
test("30", () => {
  expect(interpreter.rep('["or", false, null, 3, false, null, 4]')).toBe("3");
});
test("31", () => {
  expect(interpreter.rep('["or", ["or", false, 4]]')).toBe("4");
});

// Testing cond macro
interpreter.eval([
  "def",
  "cond",
  [
    "~",
    [
      "fn",
      ["&", "xs"],
      [
        "if",
        [">", ["count", "xs"], 0],
        [
          "list",
          ["`", "if"],
          ["first", "xs"],
          [
            "if",
            [">", ["count", "xs"], 1],
            ["nth", "xs", 1],
            ["throw", ["`", "cond: odd # of forms"]]
          ],
          ["cons", ["`", "cond"], ["rest", ["rest", "xs"]]]
        ],
        null
      ]
    ]
  ]
]);

test("32", () => {
  expect(interpreter.rep('["cond"]')).toBe("null");
});
test("33", () => {
  expect(interpreter.rep('["cond", true, 7]')).toBe("7");
});
test("34", () => {
  expect(interpreter.rep('["cond", true, 7, true, 8]')).toBe("7");
});
test("35", () => {
  expect(interpreter.rep('["cond", false, 7, true, 8]')).toBe("8");
});
test("36", () => {
  expect(
    interpreter.rep('["cond", false, 7, false, 8, ["`", "else"], 9]')
  ).toBe("9");
});
test("37", () => {
  expect(
    interpreter.rep('["cond", false, 7, ["=", 2, 2], 8, ["`", "else"], 9]')
  ).toBe("8");
});
test("38", () => {
  expect(interpreter.rep('["cond", false, 7, false, 8, false, 9]')).toBe(
    "null"
  );
});

//;;; Testing -> macro
//;
//;[-> 7]
//;;=>7
//;[-> [list 7 8 9] first]
//;;=>7
//;[-> [list 7 8 9] [first]]
//;;=>7
//;[-> [list 7 8 9] first [+ 7]]
//;;=>14
//;[-> [list 7 8 9] rest [rest] first [+ 7]]
//;;=>16

// Testing EVAL in let

test("39", () => {
  expect(
    interpreter.rep('["let", ["x", ["or", null, ["`", "yes"]]], "x"]')
  ).toBe('"yes"');
});

// Missing test.

test("101", () => {
  expect(interpreter.rep('["last", ["`", []]]')).toBe("null");
});
test("102", () => {
  expect(interpreter.rep('["last", ["`", [6]]]')).toBe("6");
});
test("103", () => {
  expect(interpreter.rep('["last", ["`", [7, 8, 9]]]')).toBe("9");
});
