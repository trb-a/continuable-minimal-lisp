/* eslint-disable */

import {
  Interpreter,
  isContinuation,
  LANGUAGE,
  VERSION
} from "../src/interpreter";

import * as YAML from "js-yaml";

const YAMLDumpOptions: YAML.DumpOptions = {
  flowLevel: 1,
  schema: YAML.DEFAULT_SAFE_SCHEMA,
  noArrayIndent: true,
  lineWidth: Infinity
  // Note: Can't use "condenseFlow: true" with flowLevel.
  // https://github.com/nodeca/js-yaml/issues/412
  // condenseFlow: true,
};
const YAMLLoadOptions: YAML.LoadOptions = {
  schema: YAML.DEFAULT_SAFE_SCHEMA
};

const interpreter = new Interpreter({
  stackMax: Infinity,
  debugMode: false,
  debugMax: Infinity
});

const p = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    if (e instanceof TypeError && e.message.match(/(circular|cyclic)/i)) {
      return undefined; // returns undefined if the value contains functions anyway.
    }
    throw e;
  }
};

// https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
const execCopy = (string: string) => {
  var tmp = document.createElement("div");
  var pre = document.createElement("pre");
  pre.style.webkitUserSelect = "auto";
  pre.style.userSelect = "auto";
  tmp.appendChild(pre).textContent = string;
  var s = tmp.style;
  s.position = "fixed";
  s.right = "200%";
  document.body.appendChild(tmp);
  document.getSelection()!.selectAllChildren(tmp);
  var result = document.execCommand("copy");
  document.body.removeChild(tmp);
  return result;
};

$("#term").terminal(
  (cmd, t) => {
    try {
      // IMPROVEME: Sometimes jquery.terminal throws error
      // when the json input includes white spaces.
      // Coundn't find way to make jquery.terminal disable
      // to parse JSON at this moment.
      t.echo(interpreter.rep(cmd));
    } catch (e) {
      if (isContinuation(e)) {
        t.echo("Suspended.");
        try {
          $<HTMLTextAreaElement>("#textarea").val(
            YAML.safeDump(e, YAMLDumpOptions)
          );
        } catch (yamlerror) {
          console.error(yamlerror);
          t.echo("Serialization failed.");
        }
      } else {
        throw e;
      }
    }
  },
  {
    greetings: `${LANGUAGE} version ${VERSION}`,
    keymap: {
      "CTRL+C": () => {} // disable the original function.
    }
    // onBeforeCommand: () => false
  }
);

$<HTMLButtonElement>("#suspend").click(() => {
  const t = $("#term").terminal();
  try {
    t.echo(`> ["suspend", null]`);
    t.echo(p(interpreter.eval(["suspend", null])));
  } catch (e) {
    if (isContinuation(e)) {
      t.echo("Suspended.");
      try {
        $<HTMLTextAreaElement>("#textarea").val(
          YAML.safeDump(e, YAMLDumpOptions)
        );
      } catch (yamlerror) {
        console.error(yamlerror);
        t.echo("Serialization failed.");
      }
    } else {
      t.exception(e, "SUSPEND");
    }
  }
});

$<HTMLButtonElement>("#resume, #resumeWithNull").click(e => {
  const t = $("#term").terminal();
  try {
    const yaml = $<HTMLTextAreaElement>("#textarea").val();
    if (typeof yaml !== "string") {
      throw "Illegal HTML element.";
    }
    if (!yaml) {
      throw "No continuation data.";
    }
    const cont = YAML.safeLoad(yaml, YAMLLoadOptions);
    if (!isContinuation(cont)) {
      throw "Illegal continuation data or version mismatch.";
    }
    let json: string | null = null;
    if (e.target.id === "resume") {
      json = window.prompt(
        "Please input parameter to resume. (Not required)(JSON/MiniMAL format)(Will be evaluated)"
      );
      if (json === null) {
        return;
      }
    }
    const param = JSON.parse(json || "null");
    t.echo(`> ["resume", #CONTINUATION, ${JSON.stringify(param)}]`);
    t.echo(p(interpreter.eval(["resume", cont, param])));
  } catch (e) {
    if (isContinuation(e)) {
      t.echo("Suspended.");
      try {
        $<HTMLTextAreaElement>("#textarea").val(
          YAML.safeDump(e, YAMLDumpOptions)
        );
      } catch (yamlerror) {
        console.error(yamlerror);
        t.echo("Serialization failed.");
      }
    } else {
      t.exception(e, "RESUME");
    }
  }
});

$<HTMLButtonElement>("#copy").click(e => {
  const yaml = $<HTMLTextAreaElement>("#textarea").val();
  if (typeof yaml !== "string") {
    throw "Illegal HTML element.";
  }
  execCopy(yaml);
});
