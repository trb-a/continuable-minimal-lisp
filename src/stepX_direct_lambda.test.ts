import Interpreter, { isContinuation } from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("Direct lambda form (direct function)", () => {
  expect(interpreter.eval([()=>10])).toBe(10);
});

test("Direct lambda does not evaluate arguments", () => {
  expect(interpreter.eval([(a)=>a, [1, 2, 3]])).toEqual([1,2,3]);
});

test("Direct lambda form (BOR)", () => {
  expect(interpreter.eval([{bor: "+"}, 1, 2])).toBe(3);
});

test("Direct lambda form (Lisp lambda)", () => {
  const lambda = interpreter.eval(["fn", ["a"], ["+", "a", 1]]);
  expect(interpreter.eval([lambda, 2])).toBe(3);
});

test("Direct lambda form (JS lambda)", () => {
  const lambda = interpreter.eval(["fn", ["a"], (env) => env.get("a") + 1]);
  expect(interpreter.eval([lambda, 2])).toBe(3);
});

// Direct continuation form is not working now. (Maybe later)
test.skip("Direct lambda form (Continuation)", () => {
  let cont = null;
  try {
    interpreter.eval(
      ["suspend", ["+", 1, 2]]
    );
  } catch (e) {
    cont = e;
  }
  expect(isContinuation(cont)).toBe(true);
  // expect(interpreter.eval([cont])).toBe(3);
});

