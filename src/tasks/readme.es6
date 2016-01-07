"use strict";

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js");

class ReadMe extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = ["contributing", "install", "license", "usage"];
    this.exceptHeaders = ["demo", "description", "dependencies", "methods", "preprocess", "properties", "structure", "style", "test"];
    this.information = [];
    this.markdown = "";
    this.tmpRoot = new PandocAstElement();
  }
  
  exec() {
    let root = this.metadata.ast.root;
    
    let self = this;
    let deleteSections = root.getElements("Header").filter(
                           function(elm, idx, arr) {
                             return elm.level == 2 && self.exceptHeaders.indexOf(elm.text.toLowerCase()) < 0
                           });
    
    for (let header of deleteSections) {
      let title = header.text;
      let bSave = false;
      
      if (/\s*(\S.*)\s*\:save\s*$/.test(title)){
        bSave = true;
        
        let newTitle = RegExp.$1;
        header.insertBefore(this.metadata.ast.createHTMLElement("<h2 id=\"#{newTitle}\">newTitle</h2>"));
      }
      
      this.section = this.selector.getSectionByHeader(header);
      
      let prev = header.prevElem;
      
      this.task();
      
      this.information.push({title: title, contents: this.markdown});
      
      if(bSave || title.toLowerCase() === "usage") {
        while (this.tmpRoot.hasChild()) {
          let elm = this.tmpRoot.firstChild;
          prev.insertAfter(elm);
          prev = elm;
        }
        
        if(bSave) {
          header.suicide();
        }
      }
      else {
        this.tmpRoot.removeAllChildren();
        header.suicide();
      }
      
      this.markdown = "";
    }
    
    return this.result();
  }
  
  task(){
    let prev = this.section[0];
    
    for (let elm of this.section) {
      this.tmpRoot.appendChild(elm);
    }
    
    this.markdown = this.metadata.ast.toMd(this.tmpRoot);
  }
  
  result(){
    return this.information;
  }
}

module.exports = ReadMe;