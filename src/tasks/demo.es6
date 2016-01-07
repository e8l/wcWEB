"use strict";

const mustache = require("mustache"),
      fs       = require("fs");

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js"),
      tools = require("../tools.js");

class Demo extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "demo";
    this.demo = [];
  }
  
  task(){
    let tmpRoot = new PandocAstElement();
    let header = this.section[0].prevElem;
    
    for (let elm of this.section) {
      if (elm.type !== "CodeBlock") {
        tmpRoot.appendChild(elm);
      }
      else {
        let explain = "";
        if (tmpRoot.hasChild()) {
          explain = this.metadata.ast.toHtml(tmpRoot);
          tmpRoot.removeAllChildren();
        }
        
        let code      = elm;
        let codeType  = code.codeType;

        if (codeType && tools.compilable(codeType)) {
          code = tools.compile(codeType, code);
        }
        
        this.demo.push({explain, code});
        
        elm.suicide();
      }
    }
    
    if (tmpRoot.hasChild()) {
      let explain = this.metadata.ast.toHtml(tmpRoot);
      this.demo.push({explain, code: ""});
      tmpRoot.removeAllChildren();
    }
    
    header.insertAfter(this.metadata.ast.createHTMLElement('<iframe src="./demo.html"></iframe>'));
  }
  
  result(){
    return this.demo;
  }
}

module.exports = Demo;