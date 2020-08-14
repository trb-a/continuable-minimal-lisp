## 2020-06-26 v0.3.0
  * <Breaking change> Changed arguments of JS lambda.

## 2020-06-26 v0.3.1
  * Suppress debug message on loading core using option debugMode.
  * New option: debugCore.

## 2020-06-30 v0.3.2
  * Exports isMacro.

## 2020-07-08 v0.3.3
  * Added callerGet/callerHas method to EnvWrapper.

## 2020-07-08 v0.4.0
  * Introduced dynamic variables similar to ISLISP.
  * Deleted callerGet/callerHas method from EnvWrapper.
  * Added dynamicGet/dynamicHas/dynamicSet method to EnvWrapper.
  * Added dynamic dynamic-let defdynamic function.

## 2020-07-10 v0.4.1
  * Added callerGet/callerHas method to EnvWrapper again.

## 2020-07-10 v0.4.2
  * Added half-macros. half-macros evaluate arguments in caller's environment
    and return value is evaluated in the caller's environment too.

## 2020-08-13 v0.4.3
  * Added "await" function and "evalAsync" method on Interpreter class.
  * Added isPromiseLike, ContinuablePromise class to support above.
  * Make Continuation's "info" property not be optional. Set null instead.
