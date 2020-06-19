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
   - Suspend wherever you want ( where you call `suspend' function).
   - Resume from the suspended point.
   - Suspended state can be serialized using YAML or other serialization tools.  
     Note: depends on what kind of data you treat in the code and serialization tool you select. 

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
   (Minified library size is about 17k including core.json. Original file size is less than 1k without core.json)
 - We don't have "slurp" "load" function and ARGS symbol. ( They are only for node.js )
 - ["new", ["fn" ...]] doesn't work. Because our lisp function is not wrapped with Javascript function.   
   (Original miniMAL [can do this](https://github.com/kanaka/miniMAL/blob/gh-pages/js/tests/stepA_miniMAL.json#L13"))
 - Resume doesn't work if the major version or minor version changes from the suspended versions.  
   Because continuation reflects the language internal strongly.

TODO
=======
 - JS async function support. When calling JS async function await until resolved and resume automatically.  
   This enables network request (like fetch()) in a lisp function.

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
