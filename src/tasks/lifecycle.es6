"use strict";

const mustache = require("mustache");

const BaseTask = require("../BaseTask.js");

class Life extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "lifecycle";
    this.lifeEvents = {};
  }
  
  task(option){
    let targetSection = ["created", "ready", "attached", "detached", "attributeChanged"];
    for (let target of targetSection) {
      let subSection = this.selector.getSection(target, this.section);
      
      if (subSection.length === 0) {
        continue;
      }
      
      let code = subSection.filter( function(elm, idx, arr) {
                   return elm.type === "CodeBlock";
                 })[0];
      if (code) {
        let space = " ".repeat(10 + target.length + 2);
        let separator = "\n" + space;
        this.lifeEvents[target] = code.content.split("\n").join(separator);
      }
      
    }
    
    this.analyzeFactoryImpl();
    
    this.section.unshift(this.section[0].prevElem);
    for (let elm of this.section) {
      elm.suicide();
    }
  }
  
  result(){
    return this.lifeEvents;
  }
  
  analyzeFactoryImpl() {
    let subSection = this.selector.getSection("factoryImpl", this.section);
    if (subSection.length === 0) {
      return;
    }
    
    let parameters = [];
    let definitions = subSection.filter( function(elm, idx, arr) {
                        elm.type === "DefinitionList";
                      });
    for (let def of definitions) {
      items = def.getElements("DescriptionItem");
      
      for (let item of items) {
        if (/(param\s+{(\S+)}\s+(?:(\S+)|([\S+]))\s+).+/.test(item.text)) {
          let param = {};
          
          param.type = RegExp.$2;
          param.name = RegExp.$3;
          param.description = item.text.slice(RegExp.$1.length);
          param.htmlDesc = this.metadata.ast.mdToHtml(param.description);
          
          if (/\[(.+)\]/.test(param.name)) {
            param.name = RegExp.$1;
            param.isOptionnal = true;
          }
          
          parameters.push(param);
        }
      }
    }
    
    let code = subSection.filter( function(elm, idx, arr) {
                  return elm.type === "CodeBlock";
                })[0];
    
    let declaration = "";
    
    if (this.metadata.script === "coffee") {
      declaration = Mustache.render("( {{#param}}{{name}}, {{/param}}", {param: parameters})
      declaration = declaration.replace(/, $/, "") + " ) ->"
    }
    else {
      declaration = mustache.render("function( {{#param}}{{name}}, {{/param}}", {param: parameters})
      declaration = declaration.replace(/, $/, "") + " ) {"
    }
    
    let definition = "";
    if (!code) {
      definition = declaration;
    }
    else {
      let space = " ".repeat(21);
      let separator = "\n" + " ".repeat(21 + 2);
      
      declaration = [declaration].concat(code.content.split("\n"));
      definition = declaration.join(separator) + "\n" + space;
    }
    
    if (this.metadata.script !== "coffee") {
      definition += "}";
    }
    
    this.lifeEvents.factoryImpl = {param: parameters, definition: definition};
  }
}

module.exports = Life;