"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const path = require("path");

const Pandoc = require("./Pandoc.js");
const PandocAstModelGenerator = require("./PandocAstModelGenerator.js");

const templatedir = path.join(__dirname, "..", "template/pandoc");

let PandocAst = (function () {
  function PandocAst(json) {
    _classCallCheck(this, PandocAst);

    this.generator = new PandocAstModelGenerator();
    this.root = this.generator.createRootElement();

    if (json !== undefined && Array.isArray(json)) {
      this.metaData = json[0];
      this.generator.construct(this.root, json[1]);
      this.generator.setText(this.root);
    }
  }

  _createClass(PandocAst, [{
    key: "createHTMLElement",
    value: function createHTMLElement(html) {
      return this.generator.createHTMLElement(html);
    }
  }, {
    key: "createDivElement",
    value: function createDivElement(id, classes, keyValue) {
      return this.generator.createDivElement(id, classes, keyValue);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      let json = [];
      json.push(this.metaData);
      json.push(this.root.to_json());

      return JSON.stringify(json);
    }
  }, {
    key: "_astToJson",
    value: function _astToJson(ast) {
      let json = [];
      json.push(this.metaData);
      let data = ast.to_json();
      if (!Array.isArray(data)) {
        data = [data];
      }

      json.push(data);

      return json;
    }
  }, {
    key: "toMd",
    value: function toMd(base) {
      let json = this._astToJson(base);
      return Pandoc.toMd(JSON.stringify(json));
    }
  }, {
    key: "toHtml",
    value: function toHtml(base) {
      let json = this._astToJson(base);
      return Pandoc.toHtml(JSON.stringify(json));
    }
  }, {
    key: "mdToHtml",
    value: function mdToHtml(md) {
      return Pandoc.mdToHtml(md);
    }
  }, {
    key: "generateManual",
    value: function generateManual(template) {
      let json = this._astToJson(this.root);
      let templatepath = path.join(templatedir, template);
      return Pandoc.exec(JSON.stringify(json), "json", "html5", ["--template", templatepath]);
    }
  }]);

  return PandocAst;
})();

module.exports = PandocAst;