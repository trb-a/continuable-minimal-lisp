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

// Keep original console.log and recover after each test.
// So we can overwrite console.log for each test.
const origConsoleLog = console.log;
afterEach(() => {
  console.log = origConsoleLog;
});

// Note: We don't have load function.
// // Stub out "~"
// interpreter.eval(["def", "~", ["fn", ["a"], null]]);
// // Load core.json
// interpreter.eval(["load", ["`", "core.json"]]);

// // Testing comments in a file
//   interpreter.eval(["load", ["`", "../tests/incB.json"]]);
// ; "incB.json finished"
// ;=>"incB.json return string"
// test("x", () => {
//   expect(interpreter.rep('["inc4", 7]')).toBe('11');
// });
// test("x", () => {
//   expect(interpreter.rep('["inc5", 7]')).toBe('12');
// });

// // Testing map literal across multiple lines in a file
// test("x", () => {
//   interpreter.eval(["load", ["`", "../tests/incC.json"]]);
//   expect(interpreter.rep('"mymap"')).toBe('{"a":1}');
// });

// Testing postponed tests that depend on interop/core.json

//
// These would normally be in step4

// Testing "list", functions
test("x", () => {
  expect(interpreter.rep('["list?", ["list"]]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["empty?", ["list"]]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["empty?", ["list", 1]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["list", 1, 2, 3]')).toBe("[1,2,3]");
});
test("x", () => {
  expect(interpreter.rep('["count", ["list", 1, 2, 3]]')).toBe("3");
});
test("x", () => {
  expect(interpreter.rep('["count", ["list"]]')).toBe("0");
});
//;["count", null]
//;;=>0
test("x", () => {
  expect(
    interpreter.rep(
      '["if", [">", ["count", ["list", 1, 2, 3]], 3], ["`", "yes"], ["`", "no"]]'
    )
  ).toBe('"no"');
});
test("x", () => {
  expect(
    interpreter.rep(
      '["if", [">=", ["count", ["list", 1, 2, 3]], 3], ["`", "yes"], ["`", "no"]]'
    )
  ).toBe('"yes"');
});

// Testing math functions

test("x", () => {
  expect(interpreter.rep('[">", 2, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('[">" ,1, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('[">" ,1, 2]')).toBe("false");
});

test("x", () => {
  expect(interpreter.rep('[">=", 2, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('[">=", 1, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('[">=", 1, 2]')).toBe("false");
});

test("x", () => {
  expect(interpreter.rep('["<=", 2, 1]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["<=", 1, 1]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["<=", 1, 2]')).toBe("true");
});

// Testing equality

//; This is different behavior than mal
test("x", () => {
  expect(interpreter.rep('["if", ["`", ""], 7, 8]')).toBe("8");
});

test("x", () => {
  expect(interpreter.rep('["=", ["`", ""], ["`", ""]]')).toBe("true");
});
test("x", () => {
  expect(interpreter.rep('["=", ["`", "abc"], ["`", ""]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", ["`", ""], ["`", "abc"]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", ["`", "abc"], ["`", "def"]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", ["list"], ["`", ""]]')).toBe("false");
});
test("x", () => {
  expect(interpreter.rep('["=", ["`", ""], ["list"]]')).toBe("false");
});

// Testing variable length arguments
test("x", () => {
  expect(
    interpreter.rep('[ ["fn", ["&", "more"], ["count", "more"]], 1, 2, 3]')
  ).toBe("3");
});
test("x", () => {
  expect(
    interpreter.rep('[ ["fn", ["&", "more"], ["count", "more"]], 1]')
  ).toBe("1");
});
test("x", () => {
  expect(interpreter.rep('[ ["fn", ["&", "more"], ["count", "more"]] ]')).toBe(
    "0"
  );
});
test("x", () => {
  expect(
    interpreter.rep('[ ["fn", ["a", "&", "more"], ["count", "more"]], 1, 2, 3]')
  ).toBe("2");
});

test("x", () => {
  expect(
    interpreter.rep('[ ["fn", ["a", "&", "more"], ["count", "more"]], 1]')
  ).toBe("0");
});

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["do", ["prn", ["`", "prn output1"]]]')).toBe("null");
  expect(messages).toContain('"prn output1"');
});

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["do", ["prn", ["`", "prn output2"]], 7]')).toBe("7");
  expect(messages).toContain('"prn output2"');
});

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["do", ["prn", ["`", "prn output1"]], ["prn", ["`", "prn output2"]], ["+", 1, 2]]'
    )
  ).toBe("3");
  expect(messages).toContain('"prn output1"');
  expect(messages).toContain('"prn output2"');
});

// -----------------------------------------------------
//
// Testing string quoting

test("x", () => {
  expect(interpreter.rep('["`", ""]')).toBe('""');
});

test("x", () => {
  expect(interpreter.rep('["`", "abc"]')).toBe('"abc"');
});

test("x", () => {
  expect(interpreter.rep('["`", "abc  def"]')).toBe('"abc  def"');
});

test("x", () => {
  expect(interpreter.rep('["`", "\\""]')).toBe('"\\""');
});

// Testing pr-str

test("x", () => {
  expect(interpreter.rep('["pr-str"]')).toBe('""');
});

test("x", () => {
  expect(interpreter.rep('["pr-str", ["`", ""]]')).toBe('"\\"\\""');
});

test("x", () => {
  expect(interpreter.rep('["pr-str", ["`", "abc"]]')).toBe('"\\"abc\\""');
});

test("x", () => {
  expect(
    interpreter.rep('["pr-str", ["`", "abc  def"], ["`", "ghi jkl"]]')
  ).toBe('"\\"abc  def\\" \\"ghi jkl\\""');
});

test("x", () => {
  expect(interpreter.rep('["pr-str", ["`", "\\""]]')).toBe('"\\"\\\\\\"\\""');
});

test("x", () => {
  expect(
    interpreter.rep(
      '["pr-str", ["list", 1, 2, ["`", "abc"], ["`", "\\""]], ["`", "def"]]'
    )
  ).toBe('"[1,2,\\"abc\\",\\"\\\\\\"\\"] \\"def\\""');
});

// Testing str

test("x", () => {
  expect(interpreter.rep('["str"]')).toBe('""');
});

test("x", () => {
  expect(interpreter.rep('["str", ["`", ""]]')).toBe('""');
});

test("x", () => {
  expect(interpreter.rep('["str", ["`", "abc"]]')).toBe('"abc"');
});

test("x", () => {
  expect(interpreter.rep('["str", ["`", "\\""]]')).toBe('"\\""');
});

test("x", () => {
  expect(interpreter.rep('["str", 1, ["`", "abc"], 3]')).toBe('"1abc3"');
});

test("x", () => {
  expect(interpreter.rep('["str", ["`", "abc  def"], ["`", "ghi jkl"]]')).toBe(
    '"abc  defghi jkl"'
  );
});

// We don't test console.log (TDDOâ) at this moment.
// // Testing prn
//   interpreter.eval(["prn"]);
// ;
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["prn"]')).toBe("null");
  expect(messages).toContain("");
});

//   interpreter.eval(["prn", ["`", ""]]);
// ; ""
// ;=>null
test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["prn", ["`", ""]]')).toBe("null");
  expect(messages).toContain('""');
});

//   interpreter.eval(["prn", ["`", "abc"]]);
// ; "abc"
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["prn", ["`", "abc"]]')).toBe("null");
  expect(messages).toContain('"abc"');
});

//   interpreter.eval(["prn", ["`", "abc  def"], ["`", "ghi jkl"]]);
// ; "abc  def" "ghi jkl"

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["prn", ["`", "abc  def"], ["`", "ghi jkl"]]')).toBe(
    "null"
  );
  expect(messages).toContain('"abc  def" "ghi jkl"');
});

//   interpreter.eval(["prn", ["`", "\""]]);
// ; "\""
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["prn", ["`", "\\""]]')).toBe("null");
  expect(messages).toContain('"\\""');
});

//   interpreter.eval(["prn", ["list", 1, 2, ["`", "abc"], ["`", "\""]], ["`", "def"]]);
// ; [1,2,"abc","\""] "def"
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["prn", ["list", 1, 2, ["`", "abc"], ["`", "\\""]], ["`", "def"]]'
    )
  ).toBe("null");
  expect(messages).toContain('[1,2,"abc","\\""] "def"');
});

// We don't test console.log (TDDOâ) at this moment.
// // Testing println
//   interpreter.eval(["println"]);
// ;
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["println"]')).toBe("null");
  expect(messages).toContain("");
});

//   interpreter.eval(["println", ["`", ""]]);
// ;
// ;=>null

test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["println", ["`", ""]]')).toBe("null");
  expect(messages).toContain("");
});

//   interpreter.eval(["println", ["`", "abc"]]);
// ; abc
// ;=>null
test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["println", ["`", "abc"]]')).toBe("null");
  expect(messages).toContain("abc");
});

//   interpreter.eval(["println", ["`", "abc  def"], ["`", "ghi jkl"]]);
// ; abc  def ghi jkl
test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep('["println", ["`", "abc  def"], ["`", "ghi jkl"]]')
  ).toBe("null");
  expect(messages).toContain("abc  def ghi jkl");
});

//   interpreter.eval(["println", ["`", "\""]]);
// ; "
// ;=>null
test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(interpreter.rep('["println", ["`", "\\""]]')).toBe("null");
  expect(messages).toContain('"');
});

//; Unquoting of strings for println doesn't work recursively yet
//;["println", ["list", 1, 2, ["`", "abc"], ["`", "\""]], ["`", "def"]]
//;; [1,2,abc,"] def
//;;=>null
test("x", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["println", ["list", 1, 2, ["`", "abc"], ["`", "\\""]], ["`", "def"]]'
    )
  ).toBe("null");
  expect(messages).toContain('[1,2,"abc","\\""] def'); // Note: I'm not sure this is correct
});
