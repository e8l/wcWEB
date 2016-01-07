"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const classes = require("./Elements.js");

let PandocAstModelGenerator = (function () {
  function PandocAstModelGenerator() {
    _classCallCheck(this, PandocAstModelGenerator);
  }

  _createClass(PandocAstModelGenerator, [{
    key: "construct",
    value: function construct(parent, jsonObj) {
      if (jsonObj === undefined) {
        parent.appendChild(this.constructNode({ t: "Empty", c: [] }));
        return parent;
      }

      if (jsonObj instanceof Array) {
        for (let elm of jsonObj) {
          parent.appendChild(this.constructNode(elm));
        }
      } else {
        parent.appendChild(this.constructNode(jsonObj));
      }

      return parent;
    }
  }, {
    key: "createRootElement",
    value: function createRootElement() {
      return new (classes.get("Root"))("");
    }
  }, {
    key: "createDivElement",
    value: function createDivElement(id, classes, keyValue) {
      return new (classes.get("Div"))([[id, classes, keyValue]]);
    }
  }, {
    key: "createHTMLElement",
    value: function createHTMLElement(html) {
      return new (classes.get("RawBlock"))(["html", html]);
    }
  }, {
    key: "setText",
    value: function setText(parent) {
      if (parent === undefined) {
        return "";
      }

      switch (parent.type) {
        case "Str":
        case "RawInline":
        case "RawBlock":
          parent.text = parent.content;
          break;
        case "LineBreak":
          parent.text = "\n";
          break;
        case "Space":
          parent.text = " ";
          break;
        case "Code":
        case "CodeBlock":
          parent.text = "";
          break;
        default:
          let inner = "";
          for (let c of parent.children) {
            inner += this.setText(c);
          }
          parent.text = inner;
      }

      return parent.text;
    }
  }, {
    key: "constructNode",
    value: function constructNode(jsonObj) {
      let type = jsonObj["t"];
      let content = jsonObj["c"];

      let generator = classes.get(type);
      let self = new generator(content);

      switch (type) {
        case "Plain":
        case "Para":
        case "BlockQuoe":
        case "Note":
        case "Emph":
        case "Strong":
        case "Strikeout":
          return this.construct(self, content);
        case "Link":
        case "Image":
          return this.construct(self, content[0]);
        case "Div":
          return this.construct(self, content[1]);
        case "Header":
          return this.construct(self, content[2]);
        case "BulletList":
          return this.constructList(self, content);
        case "OrderedList":
          return this.constructList(self, content[1]);
        case "DefinitionList":
          return this.constructDefinitionList(self, content);
        case "Table":
          return this.constructTable(self, content);
        default:
          return self;
      }
    }
  }, {
    key: "constructList",
    value: function constructList(parent, children) {
      for (let child of children) {
        let item = new (classes.get("ListItem"))("");
        parent.appendChild(item);
        this.construct(item, child);
      }
      return parent;
    }
  }, {
    key: "constructDefinitionList",
    value: function constructDefinitionList(parent, content) {
      for (let c of content) {
        let df = new (classes.get("Definition"))("");

        let term = new (classes.get("Term"))("");
        this.construct(term, c[0]);
        df.appendChild(term);

        let desc = new (classes.get("Description"))("");
        for (let elm of c[1]) {
          let item = new (classes.get("DescriptionItem"))("");
          this.construct(item, elm);
          desc.appendChild(item);
        }
        df.appendChild(desc);

        parent.appendChild(df);
      }

      return parent;
    }
  }, {
    key: "constructTable",
    value: function constructTable(parent, content) {
      let caption = new (classes.get("TableCaption"))("");
      this.construct(caption, content[0]);
      parent.appendChild(caption);

      let header = new (classes.get("TableHeader"))("");
      for (let data of content[3]) {
        this.construct(header, data);
      }
      parent.appendChild(header);

      let body = new (classes.get("TableBody"))("");

      for (let line of content[4]) {
        let row = new (classes.get("TableRow"))("");

        for (let data of line) {
          let cell = new (classes.get("TableCell"))("");
          this.construct(cell, data);
          row.appendChild(cell);
        }

        body.appendChild(row);
      }

      parent.appendChild(body);

      return parent;
    }
  }]);

  return PandocAstModelGenerator;
})();

module.exports = PandocAstModelGenerator;