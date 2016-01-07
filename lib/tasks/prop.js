"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const mustache = require("mustache");

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js"),
      templates = require("../templates.js");

const flags = ["private", "notify", "reflect", "readOnly"];

let Prop = (function (_BaseTask) {
  _inherits(Prop, _BaseTask);

  function Prop(selector, metadata) {
    _classCallCheck(this, Prop);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Prop).call(this, selector, metadata));

    _this.target = "properties";
    _this.properties = [];
    _this.privates = [];
    return _this;
  }

  _createClass(Prop, [{
    key: "task",
    value: function task() {
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
        } else {
          if (propData) {
            this._update(propData, bPrivate, lastDecl, wrapper);
            if (!bPrivate) {
              this.properties.push(propData);
            } else {
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
        } else {
          this.privates.push(propData);
        }

        sectionLast.insertAfter(this.metadata.ast.createHTMLElement("</section>"));
      }
    }
  }, {
    key: "result",
    value: function result() {
      return { publish: this.properties, private: this.privates };
    }
  }, {
    key: "_analyze",
    value: function _analyze(elm) {
      let propData = {};
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
        } else if (/^type\s+(\S+)/.test(item.text)) {
          propData.type = RegExp.$1;
        } else if (/^observer\s+(\S+)/.test(item.text)) {
          propData.observer = RegExp.$1;
          propData.badge.push("observed");
        } else if (/computed\s+((\S+)\s*\((.*)\))/.test(item.text)) {
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
      } else {
        if (!/^(?:Array|Boolean|Date|Number|Object|String)$/.test(propData.type)) {
          console.error("[Warn]");
          console.error(`Property '${ propData.name }' is unsupported type. System use default settings`);
          propData.value = "\"\"";
          propData.type = "String";
        } else if (/^(?:Array|Date|Object)$/.test(propData.type)) {
          if (metadata.code === "coffee") {
            propData.value = `() -> ${ propData.value }`;
          } else {
            propData.value = `function(){ return ${ propData.value }; }`;
          }
        } else if (!propData.value && !propData.computed) {
          console.error("[Warn]");
          console.error(`Property '${ propData.name }' is undefined. System use default value`);
          propData.value = this._getDefaultValue(propData.type);
        }
      }

      return propData;
    }
  }, {
    key: "_update",
    value: function _update(propData, bPrivate, lastDecl, wrapper) {
      let last = undefined;
      if (bPrivate) {
        last = lastDecl.prevElem;

        lastDecl.suicide();
        wrapper.removeAllChildren();
      } else {
        if (this.metadata.withComment) {
          propData.description = this.metadata.ast.toMd(wrapper);
        }

        let alt = this.metadata.ast.createHTMLElement(mustache.render(templates.get("prop"), propData));
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
  }, {
    key: "_getDefaultValue",
    value: function _getDefaultValue(type) {
      if (type === "Number") {
        return "0";
      } else if (type === "String") {
        return "\"\"";
      } else {
        return "true";
      }
    }
  }]);

  return Prop;
})(BaseTask);

module.exports = Prop;