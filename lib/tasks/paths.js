"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const fs = require("fs"),
      path = require("path");

const BaseTask = require("../BaseTask.js");

let ConstPath = (function (_BaseTask) {
  _inherits(ConstPath, _BaseTask);

  function ConstPath(selector, metadata) {
    _classCallCheck(this, ConstPath);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConstPath).call(this, selector, metadata));

    _this.paths = {};
    return _this;
  }

  _createClass(ConstPath, [{
    key: "exec",
    value: function exec() {
      let dir = path.join(__dirname, "../../config/path.json");

      try {
        this.paths = JSON.parse(fs.readFileSync(dir, "utf8"));
      } catch (e) {
        console.error("[Error]");
        console.error(`Cannot load configuration file '${ dir }'`);
      }
    }
  }, {
    key: "task",
    value: function task() {}
  }, {
    key: "result",
    value: function result() {
      return this.paths;
    }
  }]);

  return ConstPath;
})(BaseTask);

module.exports = ConstPath;