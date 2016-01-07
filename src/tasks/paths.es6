"use strict";

const fs = require("fs"),
      path = require("path");

const BaseTask = require("../BaseTask.js");

class ConstPath extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.paths = {};
  }

  exec() {
    let dir = path.join(__dirname, "../../config/path.json");
    
    try {
      this.paths = JSON.parse(fs.readFileSync(dir, "utf8"));
    }
    catch(e) {
      console.error("[Error]");
      console.error(`Cannot load configuration file '${dir}'`);
    }
  }
  
  task(){
  }

  result(){
    return this.paths;
  }
}

module.exports = ConstPath;