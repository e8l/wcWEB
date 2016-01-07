"use strict";

class SectionSelector {
  constructor(ast) {
    this.ast = ast;
    this.headers = this.ast.root.getElements("Header");
  }
  
  getTagName() {
    let results = this.headers.filter(function(elm, idx, arr){ return elm.level === 1; });
    
    return results[0].text;
  }

  search(sectionTitle) {
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

  getSectionByHeader(header) {
    if (header.type !== "Header") {
      return [];
    }

    return this._getSection(header);
  }

  getSection(sectionTitle, contents=this.headers) {
    if (contents === undefined || !Array.isArray(contents) || contents.length < 1) {
      return []
    }

    let sectionHeaders = contents.filter(function(elm, idx, arr) {
      return elm.type === "Header" && elm.level !== 1 && elm.text.match(new RegExp(sectionTitle, "i")) !== null;
    });

    if (sectionHeaders.length < 1) {
      return []
    }

    return this._getSection(sectionHeaders[0]);
  }

  moveToLast(sectionTitle) {
    return this.moveTo(sectionTitle, this.ast.root.children.length-1);
  }

  moveToHead(sectionTitle) {
    return this.moveTo(sectionTitle, 0);
  }

  isOtherSection(elm, level) {
    return elm.type === "Header" && elm.level <= level;
  }

  _getSection(header) {
    let headerLevel = header.level;
    let sectionElems = [];

    let elm = header.nextElem;
    while( elm !== undefined && !this.isOtherSection(elm, headerLevel) ) {
      sectionElems.push(elm);
      elm = elm.nextElem;
    }

    return sectionElems;
  }

  moveTo(sectionTitle, pos) {
    let sectionElems = this.getSection(sectionTitle);
    if (sectionElems === undefined || !Array.isArray(sectionElems) || sectionElems.length < 1) {
      return false
    }

    sectionElems.unshift(sectionElems[0].prevElem);

    let lastElem = this.ast.root.children[pos];

    for (let elm of sectionElems) {
      lastElem.insertAfter(elm);
      lastElem = elm;
    }

    return true;
  }
  
  removeSection(section) {
    for (let elm of section) {
      elm.suicide();
    }
  }
}

module.exports = SectionSelector;