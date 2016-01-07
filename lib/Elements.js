"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PandocAstElement = require("./PandocAstElement.js");

var classes = new Map();

// テキストやHTML

let UnitElement = (function (_PandocAstElement) {
  _inherits(UnitElement, _PandocAstElement);

  function UnitElement() {
    let type = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
    let content = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    let additional = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

    _classCallCheck(this, UnitElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UnitElement).call(this, type, content, additional));
  }

  _createClass(UnitElement, [{
    key: "to_json",
    value: function to_json() {
      return { "t": this.type, "c": this.content };
    }
  }]);

  return UnitElement;
})(PandocAstElement);

let Str = (function (_UnitElement) {
  _inherits(Str, _UnitElement);

  function Str(content) {
    _classCallCheck(this, Str);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Str).call(this, "Str", content));
  }

  return Str;
})(UnitElement);

classes.set("Str", Str);

let Space = (function (_UnitElement2) {
  _inherits(Space, _UnitElement2);

  function Space(content) {
    _classCallCheck(this, Space);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Space).call(this, "Space", content));
  }

  return Space;
})(UnitElement);

classes.set("Space", Space);

let LineBreak = (function (_UnitElement3) {
  _inherits(LineBreak, _UnitElement3);

  function LineBreak(content) {
    _classCallCheck(this, LineBreak);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LineBreak).call(this, "LineBreak", content));
  }

  return LineBreak;
})(UnitElement);

classes.set("LineBreak", LineBreak);

let HorizontalRule = (function (_UnitElement4) {
  _inherits(HorizontalRule, _UnitElement4);

  function HorizontalRule(content) {
    _classCallCheck(this, HorizontalRule);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HorizontalRule).call(this, "HorizontalRule", content));
  }

  return HorizontalRule;
})(UnitElement);

classes.set("HorizontalRule", HorizontalRule);

let RawBlock = (function (_UnitElement5) {
  _inherits(RawBlock, _UnitElement5);

  function RawBlock(content) {
    _classCallCheck(this, RawBlock);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RawBlock).call(this, "RawBlock", content));
  }

  return RawBlock;
})(UnitElement);

classes.set("RawBlock", RawBlock);

let RawInline = (function (_UnitElement6) {
  _inherits(RawInline, _UnitElement6);

  function RawInline(content) {
    _classCallCheck(this, RawInline);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RawInline).call(this, "RawInline", content));
  }

  return RawInline;
})(UnitElement);

classes.set("RawInline", RawInline);

// 段落やテキスト装飾

let BasicElement = (function (_PandocAstElement2) {
  _inherits(BasicElement, _PandocAstElement2);

  function BasicElement() {
    let type = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
    let content = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    let additional = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

    _classCallCheck(this, BasicElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BasicElement).call(this, type, content, additional));
  }

  _createClass(BasicElement, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return { "t": this.type, "c": c };
    }
  }]);

  return BasicElement;
})(PandocAstElement);

let Plain = (function (_BasicElement) {
  _inherits(Plain, _BasicElement);

  function Plain(content) {
    _classCallCheck(this, Plain);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Plain).call(this, "Plain", content));
  }

  return Plain;
})(BasicElement);

classes.set("Plain", Plain);

let Para = (function (_BasicElement2) {
  _inherits(Para, _BasicElement2);

  function Para(content) {
    _classCallCheck(this, Para);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Para).call(this, "Para", content));
  }

  return Para;
})(BasicElement);

classes.set("Para", Para);

let BlockQuote = (function (_BasicElement3) {
  _inherits(BlockQuote, _BasicElement3);

  function BlockQuote(content) {
    _classCallCheck(this, BlockQuote);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BlockQuote).call(this, "BlockQuote", content));
  }

  return BlockQuote;
})(BasicElement);

classes.set("BlockQuote", BlockQuote);

let Note = (function (_BasicElement4) {
  _inherits(Note, _BasicElement4);

  function Note(content) {
    _classCallCheck(this, Note);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Note).call(this, "Note", content));
  }

  return Note;
})(BasicElement);

classes.set("Note", Note);

let Emph = (function (_BasicElement5) {
  _inherits(Emph, _BasicElement5);

  function Emph(content) {
    _classCallCheck(this, Emph);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Emph).call(this, "Emph", content));
  }

  return Emph;
})(BasicElement);

classes.set("Emph", Emph);

let Strong = (function (_BasicElement6) {
  _inherits(Strong, _BasicElement6);

  function Strong(content) {
    _classCallCheck(this, Strong);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Strong).call(this, "Strong", content));
  }

  return Strong;
})(BasicElement);

classes.set("Strong", Strong);

let Strikeout = (function (_BasicElement7) {
  _inherits(Strikeout, _BasicElement7);

  function Strikeout(content) {
    _classCallCheck(this, Strikeout);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Strikeout).call(this, "Strikeout", content));
  }

  return Strikeout;
})(BasicElement);

classes.set("Strikeout", Strikeout);

// リンク

let LinkElement = (function (_PandocAstElement3) {
  _inherits(LinkElement, _PandocAstElement3);

  function LinkElement(type, content) {
    _classCallCheck(this, LinkElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LinkElement).call(this, type, [], content[1]));
  }

  _createClass(LinkElement, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return { "t": this.type, "c": [c, this.additional] };
    }
  }]);

  return LinkElement;
})(PandocAstElement);

let _Link = (function (_LinkElement) {
  _inherits(_Link, _LinkElement);

  function _Link(content) {
    _classCallCheck(this, _Link);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_Link).call(this, "Link", content));
  }

  return _Link;
})(LinkElement);

classes.set("Link", _Link);

let _Image = (function (_LinkElement2) {
  _inherits(_Image, _LinkElement2);

  function _Image(content) {
    _classCallCheck(this, _Image);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(_Image).call(this, "Image", content));
  }

  return _Image;
})(LinkElement);

classes.set("Image", _Image);

// コード

let CodeElement = (function (_PandocAstElement4) {
  _inherits(CodeElement, _PandocAstElement4);

  function CodeElement(type, content) {
    _classCallCheck(this, CodeElement);

    var _this19 = _possibleConstructorReturn(this, Object.getPrototypeOf(CodeElement).call(this, type, content[1], content[0]));

    _this19.codeType = _this19.additional[1][0] || "";
    return _this19;
  }

  _createClass(CodeElement, [{
    key: "to_json",
    value: function to_json() {
      return { "t": this.type, "c": [this.additional, this.content] };
    }
  }]);

  return CodeElement;
})(PandocAstElement);

let Code = (function (_CodeElement) {
  _inherits(Code, _CodeElement);

  function Code(content) {
    _classCallCheck(this, Code);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Code).call(this, "Code", content));
  }

  return Code;
})(CodeElement);

classes.set("Code", Code);

let CodeBlock = (function (_CodeElement2) {
  _inherits(CodeBlock, _CodeElement2);

  function CodeBlock(content) {
    _classCallCheck(this, CodeBlock);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CodeBlock).call(this, "CodeBlock", content));
  }

  return CodeBlock;
})(CodeElement);

classes.set("CodeBlock", CodeBlock);

// divブロック

let Div = (function (_PandocAstElement5) {
  _inherits(Div, _PandocAstElement5);

  function Div(content) {
    _classCallCheck(this, Div);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Div).call(this, "Div", [], content[0]));
  }

  _createClass(Div, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return { "t": this.type, "c": [this.additional, c] };
    }
  }]);

  return Div;
})(PandocAstElement);

classes.set("Div", Div);

// ヘッダー

let Header = (function (_PandocAstElement6) {
  _inherits(Header, _PandocAstElement6);

  function Header(content) {
    _classCallCheck(this, Header);

    var _this23 = _possibleConstructorReturn(this, Object.getPrototypeOf(Header).call(this, "Header", content[0], content[1]));

    _this23.level = _this23.content;
    return _this23;
  }

  _createClass(Header, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return { "t": this.type, "c": [this.content, this.additional, c] };
    }
  }]);

  return Header;
})(PandocAstElement);

classes.set("Header", Header);

// リスト

let BulletList = (function (_BasicElement8) {
  _inherits(BulletList, _BasicElement8);

  function BulletList(content) {
    _classCallCheck(this, BulletList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BulletList).call(this, "BulletList", []));
  }

  return BulletList;
})(BasicElement);

classes.set("BulletList", BulletList);

let DefinitionList = (function (_BasicElement9) {
  _inherits(DefinitionList, _BasicElement9);

  function DefinitionList(content) {
    _classCallCheck(this, DefinitionList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DefinitionList).call(this, "DefinitionList", []));
  }

  return DefinitionList;
})(BasicElement);

classes.set("DefinitionList", DefinitionList);

let OrderedList = (function (_BasicElement10) {
  _inherits(OrderedList, _BasicElement10);

  function OrderedList(content) {
    _classCallCheck(this, OrderedList);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(OrderedList).call(this, "OrderedList", [], content[0]));
  }

  _createClass(OrderedList, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return { "t": this.type, "c": [this.additional, c] };
    }
  }]);

  return OrderedList;
})(BasicElement);

classes.set("OrderedList", OrderedList);

let ListElement = (function (_BasicElement11) {
  _inherits(ListElement, _BasicElement11);

  function ListElement() {
    _classCallCheck(this, ListElement);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ListElement).apply(this, arguments));
  }

  _createClass(ListElement, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push(child.to_json());
      }
      return c;
    }
  }]);

  return ListElement;
})(BasicElement);

classes.set("ListElement", ListElement);

let ListItem = (function (_ListElement) {
  _inherits(ListItem, _ListElement);

  function ListItem(content) {
    _classCallCheck(this, ListItem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ListItem).call(this, "List", content));
  }

  return ListItem;
})(ListElement);

classes.set("ListItem", ListItem);

let Definition = (function (_ListElement2) {
  _inherits(Definition, _ListElement2);

  function Definition(content) {
    _classCallCheck(this, Definition);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Definition).call(this, "Definition", content));
  }

  return Definition;
})(ListElement);

classes.set("Definition", Definition);

let Term = (function (_ListElement3) {
  _inherits(Term, _ListElement3);

  function Term(content) {
    _classCallCheck(this, Term);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Term).call(this, "Term", content));
  }

  return Term;
})(ListElement);

classes.set("Term", Term);

let Description = (function (_ListElement4) {
  _inherits(Description, _ListElement4);

  function Description(content) {
    _classCallCheck(this, Description);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Description).call(this, "Description", content));
  }

  return Description;
})(ListElement);

classes.set("Description", Description);

let DescriptionItem = (function (_ListElement5) {
  _inherits(DescriptionItem, _ListElement5);

  function DescriptionItem(content) {
    _classCallCheck(this, DescriptionItem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DescriptionItem).call(this, "DescriptionItem", content));
  }

  return DescriptionItem;
})(ListElement);

classes.set("DescriptionItem", DescriptionItem);

// テーブル

let Table = (function (_PandocAstElement7) {
  _inherits(Table, _PandocAstElement7);

  function Table(content) {
    _classCallCheck(this, Table);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Table).call(this, "Table", content[1], content[2]));
  }

  _createClass(Table, [{
    key: "to_json",
    value: function to_json() {
      let cap = this.children[0].to_json();
      if (cap[1] === undefined || cap[1].length < 1) {
        cap = [];
      }

      let head = this.children[1].to_json();

      let body = this.children[2].to_json();

      return { "t": this.type, "c": [cap, this.content, this.additional, head, body] };
    }
  }]);

  return Table;
})(PandocAstElement);

classes.set("Table", Table);

let TableCaption = (function (_PandocAstElement8) {
  _inherits(TableCaption, _PandocAstElement8);

  function TableCaption(content) {
    _classCallCheck(this, TableCaption);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableCaption).call(this, "TableCaption", content));
  }

  return TableCaption;
})(PandocAstElement);

classes.set("TableCaption", TableCaption);

let TableBody = (function (_PandocAstElement9) {
  _inherits(TableBody, _PandocAstElement9);

  function TableBody(content) {
    _classCallCheck(this, TableBody);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableBody).call(this, "TableBody", content));
  }

  return TableBody;
})(PandocAstElement);

classes.set("TableBody", TableBody);

let TableRow = (function (_PandocAstElement10) {
  _inherits(TableRow, _PandocAstElement10);

  function TableRow(content) {
    _classCallCheck(this, TableRow);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableRow).call(this, "TableRow", content));
  }

  return TableRow;
})(PandocAstElement);

classes.set("TableRow", TableRow);

let TableCell = (function (_PandocAstElement11) {
  _inherits(TableCell, _PandocAstElement11);

  function TableCell(content) {
    _classCallCheck(this, TableCell);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableCell).call(this, "TableCell", content));
  }

  return TableCell;
})(PandocAstElement);

classes.set("TableCell", TableCell);

let TableHeader = (function (_PandocAstElement12) {
  _inherits(TableHeader, _PandocAstElement12);

  function TableHeader(content) {
    _classCallCheck(this, TableHeader);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TableHeader).call(this, "TableHeader", content));
  }

  _createClass(TableHeader, [{
    key: "to_json",
    value: function to_json() {
      let c = [];
      for (let child of this.children) {
        c.push([child.to_json()]);
      }
      return c;
    }
  }]);

  return TableHeader;
})(PandocAstElement);

classes.set("TableHeader", TableHeader);

// 特殊

let Root = (function (_PandocAstElement13) {
  _inherits(Root, _PandocAstElement13);

  function Root(content) {
    _classCallCheck(this, Root);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Root).call(this, "Root", content));
  }

  return Root;
})(PandocAstElement);

classes.set("Root", Root);

let Empty = (function (_PandocAstElement14) {
  _inherits(Empty, _PandocAstElement14);

  function Empty(content) {
    _classCallCheck(this, Empty);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Empty).call(this, "Empty", content));
  }

  _createClass(Empty, [{
    key: "to_json",
    value: function to_json() {
      return [];
    }
  }]);

  return Empty;
})(PandocAstElement);

classes.set("Empty", Empty);

module.exports = classes;