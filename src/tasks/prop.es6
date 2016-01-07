"use strict";

const mustache = require("mustache");

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js"),
      templates = require("../templates.js");

const flags = ["private", "notify", "reflect", "readOnly"];

class Prop extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "properties";
    this.properties = [];
    this.privates = [];
  }
  
  task(){
    let elm = undefined;
    let propData = undefined;
    
    let wrapper = new PandocAstElement();
    
    let lastDecl = undefined;
    let bPrivate = false;
    
    while (elm = this.section.shift()) {
      if (elm.type !== "DefinitionList") {
        if (lastDecl) {
          wrapper.appendChild(elm);
        }
      }
      else {
        if (propData) {
          this._update(propData, bPrivate, lastDecl, wrapper);
          if (!bPrivate) {
            this.properties.push(propData);
          }
          else {
            this.privates.push(propData);
          }
          
          elm.insertBefore(this.metadata.ast.createHTMLElement("</section>"));
        }
        
        propData = this._analyze(elm);
        bPrivate = propData.private || false;
        lastDecl = elm;
      }
    }
    if (propData) {
      let sectionLast = this._update(propData, bPrivate, lastDecl, wrapper);
      if (!bPrivate) {
        this.properties.push(propData);
      }
      else {
        this.privates.push(propData);
      }
      
      sectionLast.insertAfter(this.metadata.ast.createHTMLElement("</section>"));
    }
  }
  
  result(){
    return {publish: this.properties, private: this.privates};
  }
  
  _analyze(elm) {
    let propData = {}
    propData.badge = [];
    propData.name = elm.getElements("Term")[0].text;
    
    let descs = elm.getElements("DescriptionItem");
    for (let item of descs) {
      if (!propData.value) {
        let defaultValue = item.getElements("Code");
        if (defaultValue.length > 0) {
          propData.value = defaultValue[0].content;
          continue;
        }
      }
      
      let option = item.text.toLowerCase();
      if (flags.indexOf(option) > -1) {
        propData[option] = true;
        propData.badge.push(option);
      }
      else if(/^type\s+(\S+)/.test(item.text)){
        propData.type = RegExp.$1;
      }
      else if(/^observer\s+(\S+)/.test(item.text)){
        propData.observer = RegExp.$1;
        propData.badge.push("observed");
      }
      else if(/computed\s+((\S+)\s*\((.*)\))/.test(item.text)){
        propData.computed = RegExp.$1;
        propData.computeFunc = RegExp.$2;
        propData.computeArgs = RegExp.$3.trimRight().split(/\s*,\s*/);
        propData.badge.push("computed");
      }
    }
    
    if (propData.private) {
      if (!propData.value) {
        propData.value = "undefined";
      }
    }
    else {
      if (!/^(?:Array|Boolean|Date|Number|Object|String)$/.test(propData.type)) {
        console.error("[Warn]");
        console.error(`Property '${ propData.name }' is unsupported type. System use default settings`);
        propData.value = "\"\"";
        propData.type = "String";
      }
      else if (/^(?:Array|Date|Object)$/.test(propData.type)) {
        if (metadata.code === "coffee") {
          propData.value = `() -> ${propData.value}`;
        }
        else {
          propData.value = `function(){ return ${propData.value}; }`;
        }
      }
      else if (!propData.value && !propData.computed) {
        console.error("[Warn]");
        console.error(`Property '${ propData.name }' is undefined. System use default value`);
        propData.value = this._getDefaultValue(propData.type);
      }
    }
    
    return propData;
  }
  
  _update(propData, bPrivate, lastDecl, wrapper) {
    let last = undefined;
    if (bPrivate) {
      last = lastDecl.prevElem;
      
      lastDecl.suicide();
      wrapper.removeAllChildren();
    }
    else {
      if (this.metadata.withComment) {
        propData.description = this.metadata.ast.toMd(wrapper);
      }
      
      let alt = this.metadata.ast.createHTMLElement(
        mustache.render(templates.get("prop"), propData));
      lastDecl.parent.replaceChild(lastDecl, alt);
      
      last = alt;
      while (wrapper.hasChild()) {
        let elm = wrapper.firstChild;
        last.insertAfter(elm);
        last = elm;
      }
    }
    
    return last;
  }
  
  _getDefaultValue(type) {
    if (type === "Number") {
      return "0";
    }
    else if (type === "String") {
      return "\"\"";
    }
    else {
      return "true";
    }
  }
}

module.exports = Prop;