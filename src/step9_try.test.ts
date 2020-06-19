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

// Testing try/catch

test("1", () => {
  expect(interpreter.rep('["try", 123, ["catch", "e", 456]]')).toBe("123");
});

// ["try", ["abc", 1, 2], ["catch", "exc", ["prn", ["`", "exc is:"], "exc"]]]
// ; "exc is:" "abc not found"
// ;=>null
test("2", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["try", ["abc", 1, 2], ["catch", "exc", ["prn", ["`", "exc is:"], "exc"]]]'
    )
  ).toBe("null");
  expect(messages).toContain('"exc is:" "abc not found"');
});

//;TODO: fix so long lines don't trigger ANSI escape codes ;;;[try
//;["try", ["throw", ["data" "foo"]] ["catch", "exc", ["do", ["prn, ["`", "exc is:"], exc], 7]]] ;;;;
//;; "exc is:" ["data" "foo"] ;;;;=>7
//;;=>7

// ["try", ["throw", ["list", 1, 2, 3]], ["catch", "exc", ["do", ["prn", ["`", "err:"], "exc"], 7]]]
// ; "err:" [1,2,3]
// ;=>7
test("3", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["try", ["throw", ["list", 1, 2, 3]], ["catch", "exc", ["do", ["prn", ["`", "err:"], "exc"], 7]]]'
    )
  ).toBe("7");
  expect(messages).toContain('"err:" [1,2,3]');
});

// ["try", ["throw", ["`", "my exception"]], ["catch", "exc", ["do", ["prn", ["`", "exc:"], "exc"], 7]]]
// ; "exc:" "my exception"
// ;=>7
test("4", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  expect(
    interpreter.rep(
      '["try", ["throw", ["`", "my exception"]], ["catch", "exc", ["do", ["prn", ["`", "exc:"], "exc"], 7]]]'
    )
  ).toBe("7");
  expect(messages).toContain('"exc:" "my exception"');
});

//; Test that throw is a function:
test("5", () => {
  expect(
    interpreter.rep(
      '["try", ["map", "throw", ["list", 7]], ["catch", "exc", "exc"]]'
    )
  ).toBe("7");
});

//
// Testing builtin functions

//;[symbol? 'abc]
//;;=>true
//;[symbol? "abc"]
//;;=>false

test("6", () => {
  expect(interpreter.rep('["null?", null]')).toBe("true");
});
test("7", () => {
  expect(interpreter.rep('["null?", true]')).toBe("false");
});

test("8", () => {
  expect(interpreter.rep('["true?", true]')).toBe("true");
});
test("9", () => {
  expect(interpreter.rep('["true?", false]')).toBe("false");
});
test("10", () => {
  expect(interpreter.rep('["true?", "true?"]')).toBe("false");
});

test("11", () => {
  expect(interpreter.rep('["false?", false]')).toBe("true");
});
test("12", () => {
  expect(interpreter.rep('["false?", true]')).toBe("false");
});

// Testing apply function with core functions
test("13", () => {
  expect(interpreter.rep('["apply", "+", ["list", 2, 3]]')).toBe("5");
});
test("14", () => {
  expect(interpreter.rep('["apply", "+", 4, ["list", 5]]')).toBe("9");
});
// ["apply", "prn", ["list", 1, 2, ["`", "3"], ["list"]]]
// ; 1 2 "3" []
test("15", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  interpreter.rep('["apply", "prn", ["list", 1, 2, ["`", "3"], ["list"]]]');
  expect(messages).toContain('1 2 "3" []');
});

// ["apply", "prn", 1, 2, ["list", ["`", "3"], ["list"]]]
// ; 1 2 "3" []
test("16", () => {
  const messages: string[] = [];
  console.log = (message: string, ...args: any[]) => messages.push(message);
  interpreter.rep('["apply", "prn", 1, 2, ["list", ["`", "3"], ["list"]]]');
  expect(messages).toContain('1 2 "3" []');
});

// Testing apply function with user functions
test("17", () => {
  expect(
    interpreter.rep(
      '["apply", ["fn", ["a", "b"], ["+", "a", "b"]], ["list", 2, 3]]'
    )
  ).toBe("5");
});
test("18", () => {
  expect(
    interpreter.rep(
      '["apply", ["fn", ["a", "b"], ["+", "a", "b"]], 4, ["list", 5]]'
    )
  ).toBe("9");
});

// Testing map function
test("19", () => {
  interpreter.eval(["def", "nums", ["list", 1, 2, 3]]);
  interpreter.eval(["def", "double", ["fn", ["a"], ["*", 2, "a"]]]);
  expect(interpreter.rep('["double", 3]')).toBe("6");
});

test("20", () => {
  expect(interpreter.rep('["map", "double", "nums"]')).toBe("[2,4,6]");
});
test("21", () => {
  expect(
    interpreter.rep(
      '["map", ["fn", ["x"], ["string?", "x"]], ["list", 1, ["`", "two"], ["list", 3]]]'
    )
  ).toBe("[false,true,false]");
});

//;;; Hash map functions
//;["map?", {}]
//;;=>true
//;["map?", ["`", []]]
//;;=>false
//;["map?", ["`", "abc"]]
//;;=>false

//
// Testing hash-maps
test("22", () => {
  expect(interpreter.rep('["def", "hm0", {"a": 1}]')).toBe('{"a":1}');
});

test("23", () => {
  expect(interpreter.rep('["set", {}, ["`", "a"], 1]')).toBe('{"a":1}');
});

test("24", () => {
  expect(
    interpreter.rep(
      '["get", ["set", ["set", {"a": 1}, ["`", "b"], 2], ["`", "c"], 3], ["`", "a"]]'
    )
  ).toBe("1");
});

test("25", () => {
  expect(interpreter.rep('["def", "hm1", {}]')).toBe("{}");
});

test("26", () => {
  expect(interpreter.rep('["def", "hm2", {"a": 7}]')).toBe('{"a":7}');
});

test("27", () => {
  expect(interpreter.rep('["get", "hm1", ["`", "a"]]')).toBe("null");
});

test("28", () => {
  expect(interpreter.rep('["get", "hm2", ["`", "a"]]')).toBe("7");
});

test("29", () => {
  expect(interpreter.rep('["contains?", "hm1", ["`", "a"]]')).toBe("false");
});

test("30", () => {
  expect(interpreter.rep('["contains?", "hm2", ["`", "a"]]')).toBe("true");
});

//; TODO: fix. Clojure returns nil but this breaks mal impl
test("31", () => {
  expect(interpreter.rep('["keys", "hm1"]')).toBe("[]");
});

test("32", () => {
  expect(interpreter.rep('["keys" ,"hm2"]')).toBe('["a"]');
});

//; TODO: fix. Clojure returns nil but this breaks mal impl
test("33", () => {
  expect(interpreter.rep('["vals", "hm1"]')).toBe("[]");
});

test("34", () => {
  expect(interpreter.rep('["vals", "hm2"]')).toBe("[7]");
});

//;[count [keys [assoc hm2 "b" 2 "c" 3]]]
//;;=>3
//;
//;[def! hm3 [assoc hm2 "b" 2]]
//;[count [keys hm3]]
//;;=>2
//;[count [vals hm3]]
//;;=>2
//;
//;[dissoc hm3 "a"]
//;;=>{"b" 2}
//;
//;[dissoc hm3 "a" "b"]
//;;=>{}
//;
//;[dissoc hm3 "a" "b" "c"]
//;;=>{}
//;
//;[count [keys hm3]]
//;;=>2
//;
//;
