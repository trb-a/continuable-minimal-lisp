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

// Testing that [do [do]] not broken by TCO
test("1", () => {
  expect(interpreter.rep('["do", ["do", 1, 2]]')).toBe("2");
});

//
// Testing read, eval and slurp
test("2", () => {
  expect(interpreter.rep('["read", ["`", "[1, 2, [3, 4], null]"]]')).toBe(
    "[1,2,[3,4],null]"
  );
});

test("3", () => {
  expect(interpreter.rep('["read", ["`", "[\\"+\\", 2, 3]"]]')).toBe(
    '["+",2,3]'
  );
});

//;[read "7 ;; comment"]
//;;=>7
//;
//;;;; Differing output, but make sure no fatal error
//;[read ";; comment"]

test("4", () => {
  expect(interpreter.rep('["eval", ["read", ["`", "[\\"+\\", 2, 3]"]]]')).toBe(
    "5"
  );
});

//; TODO: fix newline matching so that this works
//;[slurp "../tests/test.txt"]
//;;=>"A line of text\n"

// Testing load
// Note: We hqven't implement this yet.
test.skip("5", () => {
  interpreter.eval(["load", ["`", "../tests/inc.json"]]);
  expect(interpreter.rep('["inc1", 7]')).toBe("8");
});
test.skip("6", () => {
  expect(interpreter.rep('["inc2", 7]')).toBe("9");
});
test.skip("7", () => {
  expect(interpreter.rep('["inc3", 9]')).toBe("12");
});

//
// Testing that ARGS exists and is an empty list
// Note: We haven't implement this.　(only for node.js)
test.skip("8", () => {
  expect(interpreter.rep('"ARGS"')).toBe("[]");
});
