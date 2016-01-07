"use strict";

const frontMatter = require("yaml-front-matter");

const pandoc = require("./Pandoc.js");

module.exports = function (filename) {
  let yaml = frontMatter.loadFront(filename);

  let result = {};

  result.yaml = yaml;
  result.raw_ast = pandoc.toJson(yaml.__content);

  return result;
};