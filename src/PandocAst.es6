"use strict";

const path = require("path");

const Pandoc = require("./Pandoc.js");
const PandocAstModelGenerator = require("./PandocAstModelGenerator.js");

const templatedir = path.join(__dirname, "..", "template/pandoc");

class PandocAst {
  constructor(json) {
    this.generator = new PandocAstModelGenerator();
    this.root = this.generator.createRootElement();

    if (json !== undefined && Array.isArray(json)) {
      this.metaData = json[0];
      this.generator.construct(this.root, json[1]);
      this.generator.setText(this.root);
    }
  }

  createHTMLElement(html) {
    return this.generator.createHTMLElement(html);
  }

  createDivElement(id, classes, keyValue) {
    return this.generator.createDivElement(id, classes, keyValue);
  }

  toJSON() {
    let json = [];
    json.push(this.metaData);
    json.push(this.root.to_json());

    return JSON.stringify(json);
  }
  
  _astToJson(ast) {
    let json = [];
    json.push(this.metaData);
    let data = ast.to_json();
    if (!Array.isArray(data)){
      data = [data];
    }
    
    json.push(data);
    
    return json
  }

  toMd(base) {
    let json = this._astToJson(base);
    return Pandoc.toMd(JSON.stringify(json));
  }

  toHtml(base) {
    let json = this._astToJson(base);
    return Pandoc.toHtml(JSON.stringify(json));
  }
  
  mdToHtml(md) {
    return Pandoc.mdToHtml(md);
  }
  
  generateManual(template) {
    let json = this._astToJson(this.root);
    let templatepath = path.join(templatedir, template);
    return Pandoc.exec(JSON.stringify(json), "json", "html5", ["--template", templatepath]);
  }
}

module.exports = PandocAst;