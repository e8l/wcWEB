"use strict";

const fs = require("fs"),
      mustache = require("mustache"),
      path = require("path"),
      process = require("process");

const analyzer = require("./analyzeMD.js"),
      bower = require("./updateBower.js"),
      PandocAst = require("./PandocAst.js"),
      SectionSelector = require("./SectionSelector.js"),
      templates = require("./templates.js"),
      tools = require("./tools.js");

const taskConfigPath = path.join(__dirname, "../config/tasks.json");

module.exports = function (argv) {
  //divide to YAML Front Matter and Markdown
  let target = analyzer(argv.filepath);
  let metadata = target.yaml;
  metadata.script = argv.coffee ? "coffee" : "polymer";

  //parsing markdown
  let ast = new PandocAst(target.raw_ast);
  metadata.ast = ast;
  metadata.__dirname = process.cwd();
  metadata.outdir = argv.outdir;

  let selector = new SectionSelector(ast);
  let info = {};

  //Does first level1 header express tag name?
  info.tagName = selector.getTagName();
  if (!info.tagName) {
    console.error("[Fatal Error]");
    console.error("You must write custom tag name at first level1 header.");
    return false;
  } else if (info.tagName === "" || info.tagName.indexOf("-") < 0) {
    console.error("[Fatal Error]");
    console.error("Illegal tag name. Tag name must have character '-' and not be empty.");
    return false;
  }

  //analyze
  let tasks = JSON.parse(fs.readFileSync(taskConfigPath));

  for (let task of tasks.tasks) {
    let script = path.join(__dirname, tasks.path, task.script);

    let mod = require(script);

    let agent = new mod(selector, metadata);
    agent.exec();
    info[task.name] = agent.result();
  }

  check(info);

  //normalize section order
  //to top
  selector.moveToHead("dependencies");
  selector.moveToHead("description");
  selector.moveToHead("demo");
  //to bottom
  selector.moveToLast("properties");
  selector.moveToLast("methods");

  //document generation
  let documentBase = ast.generateManual("manual.tmpl");
  let toc = mustache.render(templates.get("toc"), Object.assign({}, metadata, info));
  let manual = mustache.render(documentBase, { title: info.tagName, toc: toc, time: new Date() });

  fs.writeFileSync(path.join(metadata.outdir, "manual.html"), manual, "utf8");

  //readme generation
  let readme = mustache.render(templates.get("readme"), info);
  fs.writeFileSync(path.join(metadata.outdir, "readme.txt"), readme, "utf8");

  //make javascript
  let js = mustache.render(templates.get(metadata.script), info);
  js = shapingScript(js);

  if (metadata.script === "coffee") {
    js = tools.compile(metadata.script, js);
  } else if (argv.es5) {
    js = tools.compile("es5", js);
  }

  info.script = js;

  //preprocess
  if (metadata.preprocess) {
    info.structure = preprocess(metadata.preprocess["html"], "html", info.structure);
    info.style = preprocess(metadata.preprocess["css"], "css", info.style);
    info.script = preprocess(metadata.preprocess["js"], "js", info.script);
  }

  //code generation

  //demo code
  if (info.demo.length > 0) {
    let demoCode = mustache.render(templates.get("demo"), info);
    fs.writeFileSync(path.join(metadata.outdir, "demo.html"), demoCode, "utf8");
  }

  //test code
  info.simpleTests = [];
  for (let method of info.methods) {
    if (method.tests.length > 0) {
      info.simpleTests = info.simpleTests.concat(method.tests);
    }
  }
  if (info.tests.length > 0 || info.simpleTests.length > 0) {
    let testCode = mustache.render(templates.get("test"), info);
    let testdir = path.join(metadata.outdir, "test");
    let bExists = false;
    try {
      bExists = fs.statSync(testdir).isDirectory();
    } catch (e) {}
    if (!bExists) {
      fs.mkdirSync(testdir);
    }
    fs.writeFileSync(path.join(testdir, "test.html"), testCode, "utf8");
  }

  //web components
  let wc = mustache.render(templates.get("webcomponent"), info);

  if (metadata.print) {
    console.log(wc);
    return;
  }

  fs.writeFileSync(path.join(metadata.outdir, info.tagName + ".html"), wc, "utf8");

  //aftercommand
  if (metadata.aftercommand) {
    let cwd = process.cwd();
    let filename = info.tagName + ".html";

    process.chdir(metadata.outdir);
    for (let command of metadata.aftercommand) {
      tools.doCommand(command, filename);
    }
    process.chdir(cwd);
  }
};

let shapingScript = function (code) {
  code = code.replace(/,(?:[ \t\r\f]*\n)+(\s*)(}|])/g, "\n$1$2"); // remove extra comma
  return code.replace(/(?:\r$)^\n$/gm, ""); // remove empty line
};

let shapingComment = function (code) {
  code = code.replace(/(\s+\*\s+\n)(?:\s+\*\s+\n)+(\s+\*\s+@)/g, "$1$2"); // remove unnesessary line in docstring 1
  return code.replace(/(\s+\*\s+@.*\r?\n)(?:\s+\*\s+\r?\n)+/g, "$1"); // remove unnesessary line in docstring 2
};

let preprocess = function (processes, codeType, code) {
  if (!processes) {
    return code;
  }

  let source = code;

  for (let process of processes) {
    source = tools.preprocess(process, codeType, source);
  }

  return source;
};

let check = function (info) {
  let methodNames = new Set();
  let propNames = new Set();

  let observers = [];
  let observed = [];
  let computed = [];

  for (let method of info.methods) {
    methodNames.add(method.name);

    if (method.observe) {
      observers.push(method);
    }
  }

  let properties = info.properties.publish.concat(info.properties.private);

  for (let property of properties) {
    propNames.add(property.name);

    if (property.observer) {
      observed.push(property);
    }
    if (property.computed) {
      computed.push(property);
    }
  }

  if (observers.length > 0) {
    checkObserver(propNames, observers);
    info.observers = [];
    for (let observer of observers) {
      info.observers.push(observer.observerCall);
    }
  }

  if (observed.length > 0) {
    checkObserved(methodNames, observed);
  }

  if (computed.length > 0) {
    checkComputed(methodNames, propNames, computed);
  }
};

let checkObserved = function (methodNames, targets) {
  for (let target of targets) {
    if (!methodNames.has(target.observer)) {
      console.error("[Warn]");
      console.error(`Missing observer '${ target.observer }' of property '${ target.name }'.`);
    }
  }
};

let checkObserver = function (propNames, targets) {
  for (let target of targets) {
    for (let argument of target.observeProps) {
      let argName = argument.match(/[^\.]+/)[0];
      if (!propNames.has(argName)) {
        console.error("[Warn]");
        console.error(`Missing argument '${ argName }' to observer function '${ target.name }'.`);
      }
    }
  }
};

let checkComputed = function (methodNames, propNames, targets) {
  for (let target of targets) {
    if (!methodNames.has(target.computeFunc)) {
      console.error("[Warn]");
      console.error(`Missing computing function '${ target.computeFunc }' of property '${ target.name }'.`);
    }

    for (let argument of target.computeArgs) {
      let argName = argument.match(/[^\.]+/)[0];
      if (!propNames.has(argName)) {
        console.error("[Warn]");
        console.error(`Missing argument '${ argName }' to computing function of property '${ target.name }'.`);
      }
    }
  }
};
