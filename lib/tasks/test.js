"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const BaseTask = require("../BaseTask.js");

let Test = (function (_BaseTask) {
  _inherits(Test, _BaseTask);

  function Test(selector, metadata) {
    _classCallCheck(this, Test);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Test).call(this, selector, metadata));

    _this.target = "test";
    _this.testList = [];
    return _this;
  }

  _createClass(Test, [{
    key: "task",
    value: function task() {
      let header = this.section[0].prevElem;
      let level = header.level + 1;
      let eachTests = this.section.filter(function (elm, idx, arr) {
        return elm.type === "Header" && elm.level === level;
      });

      for (let test of eachTests) {
        let subSection = this.selector.getSection(test.text, this.section);
        if (subSection.length === 0) {
          continue;
        }

        let testData = {};
        testData.testName = test.text;

        let testCodes = subSection.filter(function (elm, idx, arr) {
          return elm.type === "CodeBlock";
        });
        let code = "";
        for (let frag of testCodes) {
          code += `${ frag.content }\n`;
        }
        code = code.split("\n").join("\n        ");

        testData.testCode = code;
        this.testList.push(testData);
      }

      header.suicide();
      for (let elm of this.section) {
        elm.suicide();
      }
    }
  }, {
    key: "result",
    value: function result() {
      return this.testList;
    }
  }]);

  return Test;
})(BaseTask);

module.exports = Test;