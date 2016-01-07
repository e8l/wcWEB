"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const mustache = require("mustache"),
      fs = require("fs");

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js"),
      tools = require("../tools.js");

let Demo = (function (_BaseTask) {
  _inherits(Demo, _BaseTask);

  function Demo(selector, metadata) {
    _classCallCheck(this, Demo);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Demo).call(this, selector, metadata));

    _this.target = "demo";
    _this.demo = [];
    return _this;
  }

  _createClass(Demo, [{
    key: "task",
    value: function task() {
      let tmpRoot = new PandocAstElement();
      let header = this.section[0].prevElem;

      for (let elm of this.section) {
        if (elm.type !== "CodeBlock") {
          tmpRoot.appendChild(elm);
        } else {
          let explain = "";
          if (tmpRoot.hasChild()) {
            explain = this.metadata.ast.toHtml(tmpRoot);
            tmpRoot.removeAllChildren();
          }

          let code = elm;
          let codeType = code.codeType;

          if (codeType && tools.compilable(codeType)) {
            code = tools.compile(codeType, code);
          }

          this.demo.push({ explain, code });

          elm.suicide();
        }
      }

      if (tmpRoot.hasChild()) {
        let explain = this.metadata.ast.toHtml(tmpRoot);
        this.demo.push({ explain, code: "" });
        tmpRoot.removeAllChildren();
      }

      header.insertAfter(this.metadata.ast.createHTMLElement('<iframe src="./demo.html"></iframe>'));
    }
  }, {
    key: "result",
    value: function result() {
      return this.demo;
    }
  }]);

  return Demo;
})(BaseTask);

module.exports = Demo;