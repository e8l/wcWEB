"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const BaseTask = require("../BaseTask.js"),
      tools = require("../tools.js");

let ExtractCode = (function (_BaseTask) {
  _inherits(ExtractCode, _BaseTask);

  function ExtractCode(selector, metadata) {
    _classCallCheck(this, ExtractCode);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtractCode).call(this, selector, metadata));

    _this.code = "";
    return _this;
  }

  _createClass(ExtractCode, [{
    key: "task",
    value: function task() {
      let codes = this.section.filter(function (elm) {
        return elm.type === "CodeBlock";
      });

      if (codes.length > 0) {
        let code = codes[0].content;
        let codeType = code.codeType;

        if (codeType && tools.compilable(codeType)) {
          code = tools.compile(codeType, code);
        }
        this.code = code.split('\n');
      }

      this.section.unshift(this.section[0].prevElem);
      this.selector.removeSection(this.section);
    }
  }, {
    key: "result",
    value: function result() {
      return this.code;
    }
  }]);

  return ExtractCode;
})(BaseTask);

module.exports = ExtractCode;