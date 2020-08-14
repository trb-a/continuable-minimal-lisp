import Interpreter, { isContinuation, ContinuablePromise } from "./interpreter";

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

test("Check if JS function can not raise any continuation.", () => {
  expect(() =>
    interpreter.eval([
      () => interpreter.eval(["suspend", ["+", 1, 2]])
    ])
  ).toThrow(/Javascript function can not throw any continuation/);
});

test("Check if JS Lambda can not raise any continuation.", () => {
  expect(() =>
    interpreter.eval([
      ["fn", [], () => interpreter.eval(["suspend", ["+", 1, 2]])]
    ])
  ).toThrow(/Javascript function can not throw any continuation/);
});

test("Check if JS method can not raise any continuation.", () => {
  interpreter.eval(["def", "obj", {
    "method": () => interpreter.eval(["suspend", ["+", 1, 2]]),
  }]);
  expect(() =>
    interpreter.eval([
      [".", "obj", ["`", "method"]]
    ])
  ).toThrow(/Javascript methods can not throw any continuation/);
});

test("Check if await throws continuation.", () => {
  expect(() =>
    interpreter.eval(["await"])
  ).toThrow(ContinuablePromise);
});

test("Check if await can resume the process.", () => {
  try {
    interpreter.eval(["do", ["await"], 10])
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      expect(e.resume()).toBe(10);
    } else {
      throw new Error('failed');
    }
  }
});

test("Check if await can receive and return the resolved value", async () => {
  try {
    interpreter.eval(["do", ["await", Promise.resolve(15)]])
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      await e;
      expect(e.resume()).toBe(15);
    } else {
      throw new Error('failed');
    }
  }
});

test("Check if await can receive and return the resolved value", async () => {
  try {
    interpreter.eval(["do", ["await", 100]])
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      await e;
      expect(e.resume()).toBe(100);
    } else {
      throw new Error('failed');
    }
  }
});

test("Check ContinuationPromise status methods work when pending.", async () => {
  try {
    interpreter.eval(["await", new Promise(resolve=>setTimeout(()=>null, 1000))]);
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      expect(e.isPending()).toBe(true);
      expect(e.isFulfilled()).toBe(false);
      expect(e.isRejected()).toBe(false);
      expect(()=>e.reason()).toThrow();
    } else {
      throw new Error('failed');
    }
  }
});

test("Check ContinuationPromise status methods work when resolved.", async () => {
  try {
    interpreter.eval(["await", Promise.resolve(10)]);
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      await e;
      expect(e.isPending()).toBe(false);
      expect(e.isFulfilled()).toBe(true);
      expect(e.isRejected()).toBe(false);
      expect(()=>e.reason()).toThrow();
    } else {
      throw new Error('failed');
    }
  }
});

test("Check ContinuationPromise status methods work when rejected.", async () => {
  try {
    interpreter.eval(["await", Promise.reject(14)]);
    throw new Error('failed');
  } catch (e) {
    if (e instanceof ContinuablePromise) {
      await null;
      expect(e.isPending()).toBe(false);
      expect(e.isFulfilled()).toBe(false);
      expect(e.isRejected()).toBe(true);
      expect(e.reason()).toBe(14);
      try {
        await e;
      } catch (e) {
        // Nothing. Jest may throw an error some other test after this test
        // if we don't await here...Maybe this is a Jest's bug? ⇒ Maybe so.
        // Even if we do Promise.reject(xxx) outside interpreter.eval()
        // in test(), this phenomenon occures.
      }
      // Promise.reject("XXXX"); // If you uncomment this, error occures some other test!
    } else {
      throw new Error('failed');
    }
  }
});

test("Check if evalAsync works.", async () => {
  expect(await interpreter.evalAsync(["do", ["await", Promise.resolve()], 555])).toBe(555);
});


test("Check if evalAsync and await really waits promise.", async () => {
  const start = performance.now();
  await interpreter.evalAsync(["await", new Promise(resolve=>setTimeout(resolve, 1000))]);
  const duration = performance.now() - start;
  expect(duration).toBeGreaterThan(800);
  expect(duration).toBeLessThan(1200);
});

test("Check if evalAsync and await can handle rejected promise.", async () => {
  try {
    await interpreter.evalAsync(["await", Promise.reject("error")]);
    throw new Error("failed");
  } catch (e) {
    expect(e).toBe("error");
  }
});
