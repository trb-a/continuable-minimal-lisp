import Interpreter, { isContinuation } from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("1", () => {
  try {
    interpreter.eval([
      ["do", ["def", "a", 1], ["suspend", 111], ["+", "a", 2]]
    ]);
  } catch (e) {
    expect(isContinuation(e)).toBe(true);
  }
});

test("2", () => {
  try {
    interpreter.eval([
      "do",
      ["def", "a", 1],
      ["def", "b", ["suspend", 111]],
      ["+", "a", "b"]
    ]);
  } catch (e) {
    const iptr = new Interpreter();
    expect(iptr.eval(["resume", e, 3])).toBe(4);
  }
});

test("3", () => {
  let cont = null;
  try {
    interpreter.rep(
      '["def","fib",["fn",["N"],["do",["suspend", null],["if",["=","N",0],1,["if",["=","N",1],1,["+",["fib",["-","N",1]],["fib",["-","N",2]]]]]]]]'
    );
    interpreter.rep('["fib", 5]');
  } catch (e) {
    if (isContinuation(e)) {
      cont = e;
    }
  }
  expect(cont).toBeTruthy();
});

test("Suspend at the start of the funciton", () => {
  let result = null;
  try {
    interpreter.rep(
      '["def","fib",["fn",["N"],["do",["suspend", null],["if",["=","N",0],1,["if",["=","N",1],1,["+",["fib",["-","N",1]],["fib",["-","N",2]]]]]]]]'
    );
    interpreter.rep('["fib", 4]');
  } catch (e) {
    if (isContinuation(e)) {
      let count = 0; // to avoid infinite loop;
      let cont = e;
      while (result === null && count < 100) {
        count++;
        try {
          result = interpreter.eval(["resume", cont, null]);
        } catch (e) {
          if (isContinuation(e)) {
            cont = e;
            continue;
          }
          throw e;
        }
      }
    } else {
      throw e;
    }
  }
  expect(result).toBe(5);
});

test("Suspend near the end", () => {
  let result = null;
  try {
    interpreter.rep(
      '["def","fib",["fn",["N"],["if",["=","N",0],1,["if",["=","N",1],1,["+",["fib",["-","N",1]],["do",["suspend", null],["suspend", null],["fib",["-","N",2]]]]]]]]'
    );
    result = interpreter.rep('["fib", 4]');
  } catch (e) {
    if (isContinuation(e)) {
      let count = 0; // to avoid infinite loop;
      let cont = e;
      while (result === null && count < 100) {
        count++;
        try {
          result = interpreter.eval(["resume", cont, null]);
        } catch (e) {
          if (isContinuation(e)) {
            cont = e;
            continue;
          }
          throw e;
        }
      }
    } else {
      throw e;
    }
  }
  expect(result).toBe(5);
});

test("Check if argument is evaluated before suspend.", () => {
  try {
    interpreter.eval(
      ["suspend", ["+", 1, 2]]
    );
  } catch (e) {
    expect(e["info"]).toBe(3);
  }
});
