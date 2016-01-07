"use strict";

const path = require("path"),
      process = require("process");

const clargs = require("../lib/clargs.js"),
      main   = require("../lib/main.js"),
      Scaffolding = require("../lib/scaffolding.js");

(function(){
  let argv = clargs();
  
  if (argv.command === "init") {
    new Scaffolding().run();
    return;
  }
  
  argv.filepath = argv.filepath[0];
  
  main(argv);
  
  process.exit(0);
})();