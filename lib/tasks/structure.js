"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const ExtractCode = require("./ExtractCode.js");

const baseIndent = 4;

let Structure = (function (_ExtractCode) {
  _inherits(Structure, _ExtractCode);

  function Structure(selector, metadata) {
    _classCallCheck(this, Structure);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Structure).call(this, selector, metadata));

    _this.target = "structure";
    _this.structure = "";
    return _this;
  }

  _createClass(Structure, [{
    key: "task",
    value: function task() {
      _get(Object.getPrototypeOf(Structure.prototype), "task", this).call(this);
      this.structure = this.code.join(`\n${ " ".repeat(baseIndent) }`);
    }
  }, {
    key: "result",
    value: function result() {
      return this.structure;
    }
  }]);

  return Structure;
})(ExtractCode);

module.exports = Structure;