"use strict";

const process = require("process");

const ArgumentParser = require("argparse").ArgumentParser;

module.exports = function(){
  var parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Web Components Generator"
  });

  var sub = parser.addSubparsers();

  var init = sub.addParser(
      "init",
      {
        addHelp: true,
        description: "scaffold"
      }
  );
  init.setDefaults({command: "init"});

  var gen = sub.addParser(
      "gen",
      {
        addHelp: true,
        description: "Compile to Web Components"
      }
  );
  gen.setDefaults({command: "gen"});

  var option = gen.addArgumentGroup({
    title: "option"
  });
  var exclusive = option.addMutuallyExclusiveGroup();

  exclusive.addArgument(
      ["-t", "--es6-to-es5"],
      {
        help: "transpile es6 code to es5",
        nargs: 0,
        action: "storeTrue",
        dest: "es5"
      }
  );

  exclusive.addArgument(
      ["-c", "--coffee"],
      {
        help: "use coffee script",
        nargs: 0,
        action: "storeTrue",
        dest: "coffee"
      }
  );

  option.addArgument(
      ["-p", "--print"],
      {
        help: "print out generated code",
        nargs: 0,
        action: "storeTrue",
        dest: "print"
      }
  );
  
  option.addArgument(
      ["-d", "--dest"],
      {
        help: "destination directory",
        nargs: "?",
        defaultValue: process.cwd(),
        dest: "outdir"
      }
  );

  gen.addArgument(
      ["filepath"],
      {
        help: "source file",
        nargs: "+",
      }
  );

  return parser.parseArgs();
};

