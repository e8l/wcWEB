"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let PandocAstElement = (function () {
  function PandocAstElement() {
    let type = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
    let content = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    let additional = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

    _classCallCheck(this, PandocAstElement);

    this.type = type;

    this.parent = undefined;
    this.children = [];
    this.childIndex = 0;
    this.firstChild = undefined;

    this.prevElem = undefined;
    this.nextElem = undefined;

    this.text = "";
    this.content = content;
    this.additional = additional;
  }

  _createClass(PandocAstElement, [{
    key: "hasChild",
    value: function hasChild() {
      return this.children.length > 0;
    }
  }, {
    key: "appendChild",
    value: function appendChild(elm) {
      if (!(elm instanceof PandocAstElement)) {
        return;
      }

      if (elm.parent !== undefined) {
        elm.parent.removeChild(elm);
      }
      elm.parent = this;

      if (this.children.length > 0) {
        let lastPos = this.children.length - 1;
        let lastChild = this.children[lastPos];

        lastChild.nextElem = elm;
        elm.prevElem = lastChild;
      } else {
        this.firstChild = elm;
      }

      elm.childIndex = this.children.length;
      this.children.push(elm);

      return this;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(elm) {
      if (!(elm instanceof PandocAstElement)) {
        return;
      }

      if (elm.parent !== undefined) {
        elm.parent.removeChild(elm);
      }

      elm.parent = this.parent;
      elm.nextElem = this;
      elm.prevElem = this.prevElem;
      if (this.prevElem !== undefined) {
        this.prevElem.nextElem = elm;
      }
      this.prevElem = elm;

      this.parent.children.splice(this.childIndex, 0, elm);
      this.parent.updateChild();

      return this;
    }

    // 弟要素として要素を追加する

  }, {
    key: "insertAfter",
    value: function insertAfter(elm) {
      if (!(elm instanceof PandocAstElement)) {
        return;
      }

      if (elm.parent !== undefined) {
        elm.parent.removeChild(elm);
      }

      elm.parent = this.parent;
      elm.prevElem = this;
      elm.nextElem = this.nextElem;
      if (this.nextElem !== undefined) {
        this.nextElem.prevElem = elm;
      }
      this.nextElem = elm;

      this.parent.children.splice(this.childIndex + 1, 0, elm);
      this.parent.updateChild();

      return this;
    }

    // childで指定した子要素とその子孫をelmに置き換える

  }, {
    key: "replaceChild",
    value: function replaceChild(child, elm) {
      if (!(child instanceof PandocAstElement) || child.parent !== this || !(elm instanceof PandocAstElement)) {
        return;
      }

      if (elm.parent !== undefined) {
        elm.parent.removeChild(elm);
      }

      let prevE = child.prevElem;
      let nextE = child.nextElem;
      this.removeChild(child);

      if (prevE !== undefined) {
        prevE.insertAfter(elm);
      } else if (nextE !== undefined) {
        nextE.insertBefore(elm);
      } else {
        this.appendChild(elm);
      }

      return child;
    }

    // elmを子孫に持つかを調べる

  }, {
    key: "isContain",
    value: function isContain(elm) {
      if (elm === undefined) {
        return false;
      }

      let result = false;

      for (let child of this.children) {
        if (child === elm) {
          result = true;
          break;
        } else {
          result = child.isContain(elm);
          if (result === true) {
            break;
          }
        }
      }

      return result;
    }

    // 子要素であるelmとその子孫を取り除く

  }, {
    key: "removeChild",
    value: function removeChild(elm) {
      if (!(elm instanceof PandocAstElement) || elm.parent !== this) {
        return;
      }

      elm.parent = undefined;

      let prevE = elm.prevElem;
      let nextE = elm.nextElem;

      if (nextE !== undefined) {
        nextE.prevElem = prevE;
      }

      if (prevE !== undefined) {
        prevE.nextElem = nextE;
      } else {
        this.firstChild = nextE;
      }

      elm.prevElem = elm.nextElem = undefined;

      this.children.splice(elm.childIndex, 1);

      this.updateChild();
    }

    //全ての子要素を取り除く

  }, {
    key: "removeAllChildren",
    value: function removeAllChildren() {
      while (this.hasChild()) {
        let child = this.firstChild;
        this.removeChild(child);
      }
    }

    //親要素から外れる

  }, {
    key: "suicide",
    value: function suicide() {
      if (!this.parent) {
        return;
      }

      this.parent.removeChild(this);
    }

    // タイプが一致する要素を全てリストにして返す

  }, {
    key: "getElements",
    value: function getElements(type) {
      let result = [];

      for (let child of this.children) {
        if (child.type === type) {
          result.push(child);
        }

        result = result.concat(child.getElements(type));
      }

      return result;
    }

    // クローンオブジェクトを作成する

  }, {
    key: "createClone",
    value: function createClone() {
      let copy = JSON.parse(JSON.stringify(this));
      copy.__proto__ = PandocAstElement.prototype;

      copy.parent = undefined;
      copy.childIndex = 0;

      copy.nextElem = undefined;
      copy.prevElem = undefined;

      return copy;
    }

    // 内容をjsonオブジェクトとして返す

  }, {
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return c;
    }
  }, {
    key: "toString",
    value: function toString() {
      return `<${ this.type }>`;
    }
  }, {
    key: "updateChild",
    value: function updateChild() {
      let index = 0;
      for (let child of this.children) {
        child.childIndex = index;
        index += 1;
      }
      this.firstChild = this.children[0];
    }
  }]);

  return PandocAstElement;
})();

module.exports = PandocAstElement;