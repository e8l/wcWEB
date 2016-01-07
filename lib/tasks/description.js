"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js");

let Desc = (function (_BaseTask) {
  _inherits(Desc, _BaseTask);

  function Desc(selector, metadata) {
    _classCallCheck(this, Desc);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Desc).call(this, selector, metadata));

    _this.target = "description";
    _this.description = "";
    return _this;
  }

  _createClass(Desc, [{
    key: "task",
    value: function task() {
      let tmpRoot = new PandocAstElement();

      let prev = this.section[0].prevElem;

      // move elements to temporary root
      for (let elm of this.section) {
        tmpRoot.appendChild(elm);
      }

      this.description = this.metadata.ast.toMd(tmpRoot);

      // restore to original relationship of tree
      for (let elm of this.section) {
        prev.insertAfter(elm);
        prev = elm;
      }
    }
  }, {
    key: "alternativeTask",
    value: function alternativeTask() {
      this.description = this.metadata.description || "";
    }
  }, {
    key: "result",
    value: function result() {
      return this.description;
    }
  }]);

  return Desc;
})(BaseTask);

module.exports = Desc;