"use strict";

const ExtractCode = require("./ExtractCode.js");

class PreProc extends ExtractCode {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "preprocess";
    this.preprocess = "";
  }
  
  task() {
    super.task();
    this.preprocess = this.code.join("\n      ");
  }
  
  result() {
    return this.preprocess;
  }
}

module.exports = PreProc;
