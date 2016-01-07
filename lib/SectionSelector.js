"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let SectionSelector = (function () {
  function SectionSelector(ast) {
    _classCallCheck(this, SectionSelector);

    this.ast = ast;
    this.headers = this.ast.root.getElements("Header");
  }

  _createClass(SectionSelector, [{
    key: "getTagName",
    value: function getTagName() {
      let results = this.headers.filter(function (elm, idx, arr) {
        return elm.level === 1;
      });

      return results[0].text;
    }
  }, {
    key: "search",
    value: function search(sectionTitle) {
      if (this.headers === undefined || !Array.isArray(this.headers) || this.headers.length < 1) {
        return false;
      }

      for (let elm of this.headers) {
        if (elm.type === "Header" && elm.text.match(new RegExp(sectionTitle, "i")) !== null) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "getSectionByHeader",
    value: function getSectionByHeader(header) {
      if (header.type !== "Header") {
        return [];
      }

      return this._getSection(header);
    }
  }, {
    key: "getSection",
    value: function getSection(sectionTitle) {
      let contents = arguments.length <= 1 || arguments[1] === undefined ? this.headers : arguments[1];

      if (contents === undefined || !Array.isArray(contents) || contents.length < 1) {
        return [];
      }

      let sectionHeaders = contents.filter(function (elm, idx, arr) {
        return elm.type === "Header" && elm.level !== 1 && elm.text.match(new RegExp(sectionTitle, "i")) !== null;
      });

      if (sectionHeaders.length < 1) {
        return [];
      }

      return this._getSection(sectionHeaders[0]);
    }
  }, {
    key: "moveToLast",
    value: function moveToLast(sectionTitle) {
      return this.moveTo(sectionTitle, this.ast.root.children.length - 1);
    }
  }, {
    key: "moveToHead",
    value: function moveToHead(sectionTitle) {
      return this.moveTo(sectionTitle, 0);
    }
  }, {
    key: "isOtherSection",
    value: function isOtherSection(elm, level) {
      return elm.type === "Header" && elm.level <= level;
    }
  }, {
    key: "_getSection",
    value: function _getSection(header) {
      let headerLevel = header.level;
      let sectionElems = [];

      let elm = header.nextElem;
      while (elm !== undefined && !this.isOtherSection(elm, headerLevel)) {
        sectionElems.push(elm);
        elm = elm.nextElem;
      }

      return sectionElems;
    }
  }, {
    key: "moveTo",
    value: function moveTo(sectionTitle, pos) {
      let sectionElems = this.getSection(sectionTitle);
      if (sectionElems === undefined || !Array.isArray(sectionElems) || sectionElems.length < 1) {
        return false;
      }

      sectionElems.unshift(sectionElems[0].prevElem);

      let lastElem = this.ast.root.children[pos];

      for (let elm of sectionElems) {
        lastElem.insertAfter(elm);
        lastElem = elm;
      }

      return true;
    }
  }, {
    key: "removeSection",
    value: function removeSection(section) {
      for (let elm of section) {
        elm.suicide();
      }
    }
  }]);

  return SectionSelector;
})();

module.exports = SectionSelector;