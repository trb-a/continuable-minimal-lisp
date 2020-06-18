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

// Testing recursive tail-call function
test("1", () => {
  interpreter.eval([
    "def",
    "sum2",
    [
      "fn",
      ["n", "acc"],
      ["if", ["=", "n", 0], "acc", ["sum2", ["-", "n", 1], ["+", "n", "acc"]]]
    ]
  ]);
  expect(interpreter.rep('["sum2", 10, 0]')).toBe("55");
});

test("2", () => {
  expect(interpreter.rep('["def", "res2", null]')).toBe("null");
});

// test("3", () => {
//   interpreter.eval(["def", "res2", ["sum2", 10000, 0]]);
//   expect(interpreter.rep('"res2"')).toBe("50005000");
// });
// Note: we must reduce the the number if the running
// environment checks the loop count.
// TCO (Not increasing stack length) can be checked using STACK_MAX.
test("3", () => {
  interpreter.eval(["def", "res2", ["sum2", 100, 0]]);
  expect(interpreter.rep('"res2"')).toBe("5050");
});

//;;; Test recursive non-tail call function
//;
//;[def! sum-to [fn* [n] [if [= n 0] 0 [+ n [sum-to [- n 1]]]]]]
//;
//;[sum-to 10]
//;;=>55
//;
//;;;; no try* yet, so test completion of side-effects
//;[def! res1 null]
//;;=>nil
//;;;; For implementations without their own TCO this should fail and
//;;;; leave res1 unchanged
//;[def! res1 [sum-to 10000]]
//;res1
//;;=>nil
//;
