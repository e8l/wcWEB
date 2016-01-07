"use strict";

const mustache = require("mustache");

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js"),
      templates = require("../templates.js");

const flags = ["private","chainable","async","depricated"];

const baseIndent = 8;

class Method extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "methods";
    this.methodDef = [];
  }
  
  task(){
    let wrapper = new PandocAstElement();
    let lastCodeBlock = null;
    let lastPos = this.section[0].prevElem;
    let isMethodDefBegin = false;
    let methodData = {};
    
    for (let elm of this.section) {
      if (elm.type !== "DefinitionList") {
        if (!isMethodDefBegin) {
          continue;
        }
        if (elm.type === "CodeBlock") {
          lastCodeBlock = elm;
        }
        wrapper.appendChild(elm);
      }
      else {
        if (isMethodDefBegin) {
          this.addMethodDefinition(methodData, wrapper, lastCodeBlock, lastPos);
          methodData = {};
          lastCodeBlock = null;
        }
        else {
          isMethodDefBegin = true;
        }
        
        this.analyzeMethodDeclaration(elm, methodData);
        
        if (methodData.private) {
          lastPos = elm.prevElem;
          elm.suicide();
        }
        else {
          let alt = this.metadata.ast.createHTMLElement(mustache.render(
                      templates.get("method"), methodData));
          elm.parent.replaceChild(elm, alt);
          lastPos = alt;
        }
      }
    }
    if (isMethodDefBegin) {
      this.addMethodDefinition(methodData, wrapper, lastCodeBlock, lastPos);
    }
  }
  
  result(){
    return this.methodDef;
  }
  
  analyzeMethodDeclaration(elm, methodData) {
    methodData.name = elm.getElements("Term")[0].text;
    methodData.badge = [];
    
    let parameters = [];
    let simpleTests = [];
    let testNum = 1;
    
    let items = elm.getElements("DescriptionItem");
    
    for (let item of items) {
      let option = item.text.toLowerCase();
      if (flags.indexOf(option) > -1) {
        methodData[option] = true;
        methodData.badge.push(option);
      }
      else if (/(param\s+{(\S+)}\s+(?:(\S+)|([\S+]))\s+).+/.test(item.text)) {
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
      else if (/(return(?:\s+({\S+}))?\s+)(.+)/m.test(item.text)) {
        let returnValue = {}
        
        if (RegExp.$1 !== "") {
          returnValue.type = RegExp.$2.slice(1,-2);
        }
        
        returnValue.htmlDesc = this.metadata.ast.mdToHtml(item.text.slice(RegExp.$1.length));
        returnValue.description = RegExp.$3;
        
        methodData.returnValue = returnValue;
      }
      else if (/test\s+\[(.*)\]\s+(\S.*\S?).*/.test(item.text)) {
        let testData = {};
        
        testData.name = methodData.name + "-" + testNum++;
        testData.call = `${methodData.name}(${RegExp.$1})`;
        testData.expect = RegExp.$2;
        
        simpleTests.push(testData);
      }
      else if (/observe\s+(\S.*)/.test(item.text)) {
        methodData.observe = true;
        methodData.observeProps = RegExp.$1.trimRight().split(/\s*,\s*/);
        methodData.observerCall = `${methodData.name}(${methodData.observeProps.join(", ")})`;
        methodData.badge.push("observe");
      }
    }
    
    methodData.param = parameters;
    methodData.is_param = parameters.length > 0;
    methodData.tests = simpleTests;
  }
  
  addMethodDefinition(methodData, wrapper, lastCodeBlock, lastPos) {
    let declaration = "";
    
    if (this.metadata.script === "coffee") {
      declaration = Mustache.render("( {{#param}}{{name}}, {{/param}}", {param: methodData.param})
      declaration = declaration.replace(/, $/, "") + " ) ->"
    }
    else {
      declaration = mustache.render("function( {{#param}}{{name}}, {{/param}}", {param: methodData.param})
      declaration = declaration.replace(/, $/, "") + " ) {"
    }
    
    let definition = "";
    if (!lastCodeBlock) {
      definition = declaration;
    }
    else {
      let code = lastCodeBlock.content;
      let space = " ".repeat(baseIndent+2);
      let separator = "\n" + " ".repeat(baseIndent + 2 + 2 + methodData.name.length); // second '2' means addition space for ': '
      
      declaration = [declaration].concat(code.split("\n"));
      definition = declaration.join(separator) + "\n" + " ".repeat(baseIndent);
      
      lastCodeBlock.suicide();
    }
    
    if (this.metadata.script !== "coffee") {
      definition += (lastCodeBlock ? " ".repeat(2 + methodData.name.length) : "") +"}";
    }
    
    methodData.definition = definition;
    
    let separator2 = "\n" + " ".repeat(baseIndent) + " * ";
    if (this.metadata.withComment) {
      methodData.description = this.metadata.ast.toMd(wrapper).split("\n").join(separator2);
    }
    
    if (methodData.private) {
      wrapper.removeAllChildren();
    }
    else {
      while (wrapper.hasChild()) {
        let elm = wrapper.firstChild;
        lastPos.insertAfter(elm);
        lastPos = elm;
      }
      lastPos.insertAfter(this.metadata.ast.createHTMLElement("</section>"));
    }
    
    this.methodDef.push(methodData);
  }
}

module.exports = Method;