Continuable miniMAL Lisp
==========

Continuable miniMAL Lisp is a miniMAL implementation written in Typescript with suspend/resume support.

It can run on modern browsers hopefully.

miniMAL
==========

miniMAL is a very small, but powerful Lisp formatted with JSON,
originally developped [here](https://github.com/kanaka/miniMAL).
You can find language specification [on the site](http://kanaka.github.io/miniMAL)
It has great interoperavility with Javascript.

Features
==========
 - Inherits [many great features from miniMAL](https://github.com/kanaka/miniMAL#features-and-examples):
   - Programs are written in JSON or simple Javascript array tree.
   - Macros
   - Tail call optimizations (TCO)
   - Javascript interoperavility
   - Error handling
   - Dependency free (to use as a library)
   - and more...
 - Suspend / Resume
   - Suspend wherever you want in Lisp.  
     When `suspend' function is evaluated, it throws a `Continuation' object.   
     Note: Javascript functions / methods can't throw any Continuation object.
   - Resume from the suspended point.  
     Giving a `Continuation' object to Interpreter's resume method, it resumes
     evaluation from the point where `suspend' have been evaluated. Even you can
     call `resume' in your Lisp code if you like.
   - Suspended state can be serialized using YAML or other serialization tools.  
     Note: whether it can serialized or not depends on what kind of data you treat
     in the code and serialization tool you select. For example, if you keep some 
     Javascript function in the environment, serialization will be very difficult.
 - Dynamic variables
   - Similar to ISLisp's dynamic variables. (dynamic/defdynamic/dynamic-let)
 - Half macros
   - Like macros, but arguments are evaluated in the caller's environment.  
     This function is usefull if you want to implement a function with javascript
     but the return value is evaluated as a lisp. (ex. "suspend").
 - Wait for promises like Javascript's async/await.
   - With "evalAsync" method of the interpreter, ["await" &lt;promise&gt;] can work
     like Javascript's `await'. ["await" &lt;promise&gt;] waits until the promise
     resolves, and resumes after the promise have been resolved.
   - "evalAsync" methods returns a PromiseLike. you can treat the returned value
     by async/await.
   - Without using "evalAsync" method, "await" throws ContinuablePromise instance.
     ContinuablePromise can resume the evaluation after the promise have been
     resolved..

Online REPL Demo
==========

You can try [REPL demo](https://trb-a.github.io/continuable-minimal-lisp/).

How to use
==========

Install:  
Note: not published to npm yet.
```
yarn add https://github.com/trb-a/continuable-minimal-lisp.git
```
or 
```
npm install git+https://github.com/trb-a/continuable-minimal-lisp.git
```
In your code: 
```TypeScript
import { Interpreter } from "continuable-minimal-lisp";
const interpreter = new Interpreter();
const value = interpreter.eval(
  ["do",
    ["def", "fun", ["fn", ["a", "b"], ["+", "a", "b"]]],
    ["fun", 1, 2]]
);
console.log(value); // or somwhere else.
```

Limitations
==========
 - Only for modern browsers. Only tested on newest Chrome at this moment.  
   Bug reports are welcome, but we never support IE.
 - Not tested on node.js environment at this moment (Maybe it's rare request).
 - It's still miniMAL, but not minimal anymore as of file size.  
   (Minified module size is about 46k including core.json and tslib. Original miniMAL's file size is less than 1k without core.json)
 - We don't have "slurp" "load" function and ARGS symbol. ( They are only for node.js )
 - Resume doesn't work if the major version or minor version changes from the suspended versions.  
   Because continuation reflects the language internal strongly.

TODO
=======
 - Explanation about BOR, Calling JS function, difference between between Lisp function Lisp labmda,  
   Lisp macro, JS (labmda) macro, special forms. (if requested)

License
=======

Interpreter implementation is licensed under MIT.
Language specification is XXXXXXXXXX ( TODO: need check. )
The modules which web site depends on (jquery, js-yaml, jquery-terminal, etc.) have their own license.

Contact
=======

https://github.com/trb-a/continuable-minimal-lisp

Toribune Co., Ltd
https://www.toribune.co.jp
