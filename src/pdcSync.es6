"use strict";

let spawn = require("child_process").spawnSync;

function pdcSync(src, from, to, args, opts) {
  let defaultArgs = ["-f", from, "-t", to];
  
  if (args === undefined) {
    args = defaultArgs;
  }
  else {
    args = defaultArgs.concat(args);
  }
  
  if (typeof opts !== "object" || opts === null) {
    opts = {encoding: "utf8"};
  }
  else if (opts.encoding === undefined) {
    opts.encoding = "utf8";
  }
  opts.input = src;
  
  let pandoc = spawn(pdcSync.path, args, opts);
  
  if (pandoc.status) {
    let msg = "pandoc exited with code ";
    msg += pandoc.status;
    
    if (pandoc.stderr.length) {
      msg += ": " + pandoc.stderr.toString("utf8");
    }
    
    msg += ".";
    
    throw new Error(msg);
  }
  
  return pandoc.stdout.toString("utf8");
}

module.exports = pdcSync;

pdcSync.path = "pandoc";