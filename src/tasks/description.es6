"use strict";

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js");

class Desc extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "description";
    this.description = "";
  }
  
  task(){
    let tmpRoot = new PandocAstElement();
    
    let prev = this.section[0].prevElem;
    
    // move elements to temporary root
    for (let elm of this.section) {
      tmpRoot.appendChild(elm);
    }
    
    this.description = this.metadata.ast.toMd(tmpRoot);
    
    // restore to original relationship of tree
    for (let elm of this.section) {
      prev.insertAfter(elm);
      prev = elm;
    }
  }
  
  alternativeTask() {
    this.description = this.metadata.description || "";
  }
  
  result(){
    return this.description;
  }
}

module.exports = Desc;