"use strict";

const BaseTask = require("../BaseTask.js"),
      tools    = require("../tools.js");

class ExtractCode extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.code = "";
  }

  task(){
    let codes = this.section.filter(function(elm){ return elm.type === "CodeBlock"; });

    if (codes.length > 0) {
      let code      = codes[0].content;
      let codeType  = code.codeType;

      if (codeType && tools.compilable(codeType)) {
        code = tools.compile(codeType, code);
      }
      this.code = code.split('\n');
    }

    this.section.unshift(this.section[0].prevElem);
    this.selector.removeSection(this.section);
  }

  result(){
    return this.code;
  }
}

module.exports = ExtractCode;