"use strict";

const pdc  = require("./pdcSync.js");

module.exports = {
  defaultMeta: {
    unMeta: {}
  },
  
  exec(src, from, to, args) {
    return pdc(src, from, to, args);
  },
  
  toJson(text) {
    return JSON.parse(pdc(text, "markdown", "json"));
  },
  
  toMd(json) {
    return pdc(json, "json", "markdown");
  },
  
  toHtml(json) {
    return pdc(json, "json", "html5");
  },
  
  mdToHtml(md) {
    return pdc(md, "markdown", "html5");
  }
};