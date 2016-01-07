"use strict";

const ExtractCode = require("./ExtractCode.js");

const baseIndent = 6;

class Style extends ExtractCode {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "style";
    this.style = "";
  }
  
  task() {
    super.task();
    this.style = this.code.join(`\n${" ".repeat(baseIndent)}`);
  }
  
  result() {
    return this.style;
  }
}

module.exports = Style;
