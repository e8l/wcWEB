"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const BaseTask = require("../BaseTask.js"),
      PandocAstElement = require("../PandocAstElement.js");

let ReadMe = (function (_BaseTask) {
  _inherits(ReadMe, _BaseTask);

  function ReadMe(selector, metadata) {
    _classCallCheck(this, ReadMe);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReadMe).call(this, selector, metadata));

    _this.target = ["contributing", "install", "license", "usage"];
    _this.exceptHeaders = ["demo", "description", "dependencies", "methods", "preprocess", "properties", "structure", "style", "test"];
    _this.information = [];
    _this.markdown = "";
    _this.tmpRoot = new PandocAstElement();
    return _this;
  }

  _createClass(ReadMe, [{
    key: "exec",
    value: function exec() {
      let root = this.metadata.ast.root;

      let self = this;
      let deleteSections = root.getElements("Header").filter(function (elm, idx, arr) {
        return elm.level == 2 && self.exceptHeaders.indexOf(elm.text.toLowerCase()) < 0;
      });

      for (let header of deleteSections) {
        let title = header.text;
        let bSave = false;

        if (/\s*(\S.*)\s*\:save\s*$/.test(title)) {
          bSave = true;

          let newTitle = RegExp.$1;
          header.insertBefore(this.metadata.ast.createHTMLElement("<h2 id=\"#{newTitle}\">newTitle</h2>"));
        }

        this.section = this.selector.getSectionByHeader(header);

        let prev = header.prevElem;

        this.task();

        this.information.push({ title: title, contents: this.markdown });

        if (bSave || title.toLowerCase() === "usage") {
          while (this.tmpRoot.hasChild()) {
            let elm = this.tmpRoot.firstChild;
            prev.insertAfter(elm);
            prev = elm;
          }

          if (bSave) {
            header.suicide();
          }
        } else {
          this.tmpRoot.removeAllChildren();
          header.suicide();
        }

        this.markdown = "";
      }

      return this.result();
    }
  }, {
    key: "task",
    value: function task() {
      let prev = this.section[0];

      for (let elm of this.section) {
        this.tmpRoot.appendChild(elm);
      }

      this.markdown = this.metadata.ast.toMd(this.tmpRoot);
    }
  }, {
    key: "result",
    value: function result() {
      return this.information;
    }
  }]);

  return ReadMe;
})(BaseTask);

module.exports = ReadMe;