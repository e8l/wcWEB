"use strict";

const path = require("path"),
      fs   = require("fs");

const basedir = path.join(__dirname, "..", "template");
const licensedir = path.join(basedir, "licenses");

let templates = new Map();
let licenses = new Map();

let construct = function(dir, callback) {
  for (let file of fs.readdirSync(dir)) {
    if (fs.statSync(path.join(dir, file)).isFile() && /(.*)\.tmpl/.test(file)) {
      callback(RegExp.$1, file);
    }
  }
};

construct(basedir, function(name, full){
  let contents = fs.readFileSync(path.join(basedir, full), "utf8");
  templates.set(name, contents);
});

construct(licensedir, function(name, full){
  let contents = fs.readFileSync(path.join(licensedir, full), "utf8");
  licenses.set(name, path.join(licensedir, contents));
});

templates.set("licenses", licenses);

module.exports = templates;
