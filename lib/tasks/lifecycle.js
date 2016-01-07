"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const mustache = require("mustache");

const BaseTask = require("../BaseTask.js");

let Life = (function (_BaseTask) {
  _inherits(Life, _BaseTask);

  function Life(selector, metadata) {
    _classCallCheck(this, Life);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Life).call(this, selector, metadata));

    _this.target = "lifecycle";
    _this.lifeEvents = {};
    return _this;
  }

  _createClass(Life, [{
    key: "task",
    value: function task(option) {
      let targetSection = ["created", "ready", "attached", "detached", "attributeChanged"];
      for (let target of targetSection) {
        let subSection = this.selector.getSection(target, this.section);

        if (subSection.length === 0) {
          continue;
        }

        let code = subSection.filter(function (elm, idx, arr) {
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
  }, {
    key: "result",
    value: function result() {
      return this.lifeEvents;
    }
  }, {
    key: "analyzeFactoryImpl",
    value: function analyzeFactoryImpl() {
      let subSection = this.selector.getSection("factoryImpl", this.section);
      if (subSection.length === 0) {
        return;
      }

      let parameters = [];
      let definitions = subSection.filter(function (elm, idx, arr) {
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

      let code = subSection.filter(function (elm, idx, arr) {
        return elm.type === "CodeBlock";
      })[0];

      let declaration = "";

      if (this.metadata.script === "coffee") {
        declaration = Mustache.render("( {{#param}}{{name}}, {{/param}}", { param: parameters });
        declaration = declaration.replace(/, $/, "") + " ) ->";
      } else {
        declaration = mustache.render("function( {{#param}}{{name}}, {{/param}}", { param: parameters });
        declaration = declaration.replace(/, $/, "") + " ) {";
      }

      let definition = "";
      if (!code) {
        definition = declaration;
      } else {
        let space = " ".repeat(21);
        let separator = "\n" + " ".repeat(21 + 2);

        declaration = [declaration].concat(code.content.split("\n"));
        definition = declaration.join(separator) + "\n" + space;
      }

      if (this.metadata.script !== "coffee") {
        definition += "}";
      }

      this.lifeEvents.factoryImpl = { param: parameters, definition: definition };
    }
  }]);

  return Life;
})(BaseTask);

module.exports = Life;