"use strict";

var PandocAstElement = require("./PandocAstElement.js");

var classes = new Map();

// テキストやHTML

class UnitElement extends PandocAstElement {
  constructor(type="", content=[], additional=undefined) {
    super(type, content, additional);
  }

  to_json() {
    return {"t": this.type, "c": this.content};
  }
}

class Str extends UnitElement {
  constructor(content) {
    super("Str", content);
  }
}
classes.set("Str", Str);

class Space extends UnitElement {
  constructor(content) {
    super("Space", content);
  }
}
classes.set("Space", Space);

class LineBreak extends UnitElement {
  constructor(content) {
    super("LineBreak", content);
  }
}
classes.set("LineBreak", LineBreak);

class HorizontalRule extends UnitElement {
  constructor(content) {
    super("HorizontalRule", content)
  }
}
classes.set("HorizontalRule", HorizontalRule);

class RawBlock extends UnitElement {
  constructor(content) {
    super("RawBlock", content)
  }
}
classes.set("RawBlock", RawBlock);

class RawInline extends UnitElement {
  constructor(content) {
    super("RawInline", content)
  }
}
classes.set("RawInline", RawInline);

// 段落やテキスト装飾

class BasicElement extends PandocAstElement {
  constructor(type="", content=[], additional=undefined) {
    super(type, content, additional);
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json())
    }
    return {"t": this.type, "c": c}
  }
}

class Plain extends BasicElement {
  constructor(content) {
    super("Plain", content);
  }
}
classes.set("Plain", Plain);

class Para extends BasicElement {
  constructor(content) {
    super("Para", content);
  }
}
classes.set("Para", Para);

class BlockQuote extends BasicElement {
  constructor(content) {
    super("BlockQuote", content);
  }
}
classes.set("BlockQuote", BlockQuote);

class Note extends BasicElement {
  constructor(content) {
    super("Note", content);
  }
}
classes.set("Note", Note);

class Emph extends BasicElement {
  constructor(content) {
    super("Emph", content);
  }
}
classes.set("Emph", Emph);

class Strong extends BasicElement {
  constructor(content) {
    super("Strong", content);
  }
}
classes.set("Strong", Strong);

class Strikeout extends BasicElement {
  constructor(content) {
    super("Strikeout", content);
  }
}
classes.set("Strikeout", Strikeout);

// リンク

class LinkElement extends PandocAstElement {
  constructor(type, content) {
    super(type, [], content[1]);
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json());
    }
    return {"t": this.type, "c": [c, this.additional]};
  }
}

class _Link extends LinkElement {
  constructor(content) {
    super("Link", content)
  }
}
classes.set("Link", _Link);

class _Image extends LinkElement {
  constructor(content) {
    super("Image", content)
  }
}
classes.set("Image", _Image);

// コード

class CodeElement extends PandocAstElement {
  constructor(type, content) {
    super(type, content[1], content[0]);
    this.codeType = this.additional[1][0] || "";
  }

  to_json() {
    return {"t": this.type, "c": [this.additional, this.content]};
  }
}

class Code extends CodeElement {
  constructor(content) {
    super("Code", content);
  }
}
classes.set("Code", Code);

class CodeBlock extends CodeElement {
  constructor(content) {
    super("CodeBlock", content);
  }
}
classes.set("CodeBlock", CodeBlock);

// divブロック

class Div extends PandocAstElement {
  constructor(content) {
    super("Div", [], content[0]);
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json());
    }
    return {"t": this.type, "c": [this.additional, c]};
  }
}
classes.set("Div", Div);

// ヘッダー

class Header extends PandocAstElement {
  constructor(content) {
    super("Header", content[0], content[1]);
    this.level = this.content;
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json());
    }
    return {"t": this.type, "c": [this.content, this.additional, c]};
  }
}
classes.set("Header", Header);

// リスト

class BulletList extends BasicElement {
  constructor(content) {
    super("BulletList", []);
  }
}
classes.set("BulletList", BulletList);

class DefinitionList extends BasicElement {
  constructor(content) {
    super("DefinitionList", [])
  }
}
classes.set("DefinitionList", DefinitionList);

class OrderedList extends BasicElement {
  constructor(content) {
    super("OrderedList", [], content[0]);
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json());
    }
    return {"t": this.type, "c": [this.additional, c]};
  }
}
classes.set("OrderedList", OrderedList);

class ListElement extends BasicElement {
  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push(child.to_json());
    }
    return c;
  }
}
classes.set("ListElement", ListElement);

class ListItem extends ListElement {
  constructor(content) {
    super("List", content);
  }
}
classes.set("ListItem", ListItem);

class Definition extends ListElement {
  constructor(content) {
    super("Definition", content);
  }
}
classes.set("Definition", Definition);

class Term extends ListElement {
  constructor(content) {
    super("Term", content);
  }
}
classes.set("Term", Term);

class Description extends ListElement {
  constructor(content) {
    super("Description", content);
  }
}
classes.set("Description", Description);

class DescriptionItem extends ListElement {
  constructor(content) {
    super("DescriptionItem", content);
  }
}
classes.set("DescriptionItem", DescriptionItem);

// テーブル

class Table extends PandocAstElement {
  constructor(content) {
    super("Table", content[1], content[2]);
  }

  to_json() {
    let cap = this.children[0].to_json();
    if (cap[1] === undefined || cap[1].length < 1) {
      cap = [];
    }

    let head = this.children[1].to_json();

    let body = this.children[2].to_json();

    return {"t": this.type, "c": [cap, this.content, this.additional, head, body]};
  }
}
classes.set("Table", Table);

class TableCaption extends PandocAstElement {
  constructor(content) {
    super("TableCaption", content);
  }
}
classes.set("TableCaption", TableCaption);

class TableBody extends PandocAstElement {
  constructor(content) {
    super("TableBody", content);
  }
}
classes.set("TableBody", TableBody);

class TableRow extends PandocAstElement {
  constructor(content) {
    super("TableRow", content);
  }
}
classes.set("TableRow", TableRow);

class TableCell extends PandocAstElement {
  constructor(content) {
    super("TableCell", content)
  }
}
classes.set("TableCell", TableCell);

class TableHeader extends PandocAstElement {
  constructor(content) {
    super("TableHeader", content)
  }

  to_json() {
    let c = [];
    for (let child of this.children) {
      c.push([child.to_json()]);
    }
    return c;
  }
}
classes.set("TableHeader", TableHeader);

// 特殊

class Root extends PandocAstElement {
  constructor(content) {
    super("Root", content);
  }
}
classes.set("Root", Root);

class Empty extends PandocAstElement {
  constructor(content) {
    super("Empty", content);
  }

  to_json() {
    return [];
  }
}
classes.set("Empty", Empty);

module.exports = classes;