"use strict";

const ExtractCode = require("./ExtractCode.js");

const baseIndent = 4;

class Structure extends ExtractCode {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "structure";
    this.structure = "";
  }
  
  task() {
    super.task();
    this.structure = this.code.join(`\n${" ".repeat(baseIndent)}`);
  }
  
  result() {
    return this.structure;
  }
}

module.exports = Structure;
