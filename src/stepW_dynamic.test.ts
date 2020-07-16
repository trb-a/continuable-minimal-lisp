import Interpreter from "./interpreter";

const DEBUG = false;
const DEBUG_MAX = 100;
const STACK_MAX = 100;

const interpreter = new Interpreter({
  stackMax: STACK_MAX
});
interpreter.debugMode = DEBUG;
interpreter.debugMax = DEBUG_MAX;

test("Define dynamic variable", () => {
  expect(interpreter.eval(["defdynamic", "*num*", 10])).toBe(10);
});

test("Get dynamic variable", () => {
  expect(interpreter.eval(["dynamic", "*num*"])).toBe(10);
});

test("Getting dynamic variables not defined throws error.", () => {
  expect(()=> interpreter.eval(["dynamic", "XXXX"])).toThrow(/dynamic variable XXXX not found/);
});

test("Dynamic variables can be defined in a function and get value outside the function", () => {
  interpreter.eval(["def", "f", ["fn", [], ["defdynamic", "*color*", ["`", "red"]]]]);
  interpreter.eval(["def", "f2", ["fn", [], ["dynamic", "*color*"]]]);
  expect(interpreter.eval(["f"])).toBe("red");
  expect(interpreter.eval(["dynamic", "*color*"])).toBe("red");
  expect(interpreter.eval(["f2"])).toBe("red");
});

test("dynamic-let form", () => {
  expect(interpreter.eval(["dynamic-let", ["*num*", 20], ["dynamic", "*num*"]])).toBe(20);
});

test("values will be recovered after dynamic-let", () => {
  expect(interpreter.eval(["defdynamic", "*num*", 15])).toBe(15);
  expect(interpreter.eval(["dynamic-let", ["*num*", 20], ["dynamic", "*num*"]])).toBe(20);
  expect(interpreter.eval(["dynamic", "*num*"])).toBe(15);
});

test("defdynamic defines in root env even in dynamic-let", () => {
  expect(interpreter.eval(["defdynamic", "*num*", 15])).toBe(15);
  expect(interpreter.eval(["dynamic-let", ["*num*", 20], ["defdynamic", "*num*", 25]])).toBe(25);
  expect(interpreter.eval(["dynamic", "*num*"])).toBe(25);
});


test("JS lambda functions can refer dynamic variables", () => {
  interpreter.eval(["def", "ff", ["fn", [], ["defdynamic", "*str*", ["`", "aaa"]]]]);
  interpreter.eval(["ff"]);
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.dynamicHas("*str*")]]);
  expect(interpreter.eval(["jsf"])).toBe(true);
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.dynamicHas("xxxx")]]);
  expect(interpreter.eval(["jsf"])).toBe(false);
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.dynamicGet("*str*")]]);
  expect(interpreter.eval(["jsf"])).toBe("aaa");
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.dynamicGet("xxx")]]);
  expect(interpreter.eval(["jsf"])).toBe(null);
});

test("JS lambda functions can define dynamic variables", () => {
  interpreter.eval(["def", "jsf", ["fn", [], (env)=>env.dynamicSet("s", "sss")]]);
  interpreter.eval(["jsf"]);
  expect(interpreter.eval(["dynamic", "s"])).toBe("sss");
});
