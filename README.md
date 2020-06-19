Continuable miniMAL Lisp
==========

Continuable miniMAL Lisp is a miniMAL implementation written in Typescript with suspend/resume support.

It can run on modern browsers hopefully.

miniMAL
==========

miniMAL is a very small, but Lisp formatted with JSON,
originally developped [here](https://github.com/kanaka/miniMAL).
You can find language spec [on the site](http://kanaka.github.io/miniMAL)
It has powerful interoperavility with Javascript.

REPL
-----

You can try [here](https://github.com/trb-a/continuable-minimal-lisp/docs/index.html)

How to use
==========

TODO: not published to npm yet.


Limitations
==========
 - Insufficient TCO (tail call optimization). We are working on it.
 - Only for modern browsers. Only tested on newest Chrome at this moment.
   Bug reports are welcome, but we never support IE.
 - Hopefully able to run on modern browsers, but not tested on node.js environment at this moment.
 - We don't have "slurp" "load" function and ARGS symbol. ( They are only for node.js )
 - ["new", ["fn" ...]] doesn't work. Because our function is not wrapped with Javascript function. 
   (Original miniMAL [can do this](https://github.com/kanaka/miniMAL/blob/gh-pages/js/tests/stepA_miniMAL.json#L13")
 - Resume doesn't work if the Continuable miniMAL Lisp's major version or minor version changes 
   because continuation reflects the language internal strongly.

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
