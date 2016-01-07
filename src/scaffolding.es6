"use strict";

const mustache = require("mustache"),
      path     = require("path"),
      fs       = require("fs"),
      co       = require("co"),
      rl       = require("readline").createInterface(process.stdin, process.stdout);

const templates = require("./templates.js");

class Scaffolding {

  constructor() {
    this.data = {
      "dependencies": {
        "webcomponentsjs": ">=0.7.7 <1.0.0",
        "polymer": ">=1.0.8 <2.0.0"
      }
    };
  }

  run() {
    let self = this;
    co(function* (){
      // interactive setting
      yield self.name();
      yield self.version();
      yield self.description();
      yield self.keywords();
      yield self.authors();
      yield self.license();
      yield self.homepage();
      yield self.ignore();

      // make directories and files
      yield [
        self.makeMainFile(),
        self.makeBowerJson(),
        self.makeGitIgnore(),
        self.makeLicense()
      ];

      rl.close();
    }).catch((err) => {throw err;});
  }

  name() {
    let current_dir = path.basename(path.resolve("."));

    let default_name = "my-web-component";
    let reg = current_dir.match(/^[A-Za-z][A-Za-z0-9_]*(?:\-[A-Za-z0-9_]+)+$/);
    if (reg) {
      default_name = reg[0].toLowerCase();
    }
    else if (reg = current_dir.match(/^[A-Za-z][A-Za-z0-9_]*$/)) {
      default_name = reg[0].toLowerCase() + "-element";
    }

    let self = this;
    let loop = function(resolve, reject) {
      rl.question(`name (${default_name}): `, function(ans) {
        if (ans.match(/^[A-Za-z][A-Za-z0-9_]*(?:\-[A-Za-z0-9_]+)+$/)) {
          self.data["name"] = ans;
          resolve();
          return;
        }
        else if (ans === "") {
          self.data["name"] = default_name;
          resolve();
          return;
        }
        console.log ("[error] invalid web component name!");
        loop(resolve, reject);
      });
    };

    return new Promise(loop);
  }

  version() {
    let default_version = "0.0.0";

    let self = this;
    let loop = function(resolve, reject) {
      rl.question(`version (${default_version}): `, function(ans) {
        if (ans.match(/^(?:\d|[1-9]\d+)\.(?:\d|[1-9]\d+)\.(?:\d|[1-9]\d+)(?:\-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/)) {
          self.data["version"] = ans;
          resolve();
          return;
        }
        else if (ans === "") {
          self.data["version"] = default_version;
          resolve();
          return;
        }
        console.log("[error] invalid web component name!");
        loop(resolve, reject);
      });
    };

    return new Promise(loop);
  }

  description() {
    let self = this;;

    return new Promise(function(resolve,reject){
      rl.question("description: ", function(ans){
        self.data["description"] = ans;
        resolve();
      });
    });
  }

  keywords() {
    let self = this;

    return new Promise(function(resolve,reject){
      rl.question("keywords (Comma-separated): ", function(ans){
        let keywords = ans.split(/\s*,\s*/).concat(["Polymer", "web-components"]);
        self.data["keywords"] = Array.from(new Set(keywords));
        resolve();
      });
    });
  }

  authors() {
    let self = this;

    return new Promise(function(resolve, reject){
      rl.question("authors (Comma-separated): ", function(ans){
        self.data["authors"] = Array.from(new Set(ans.split(/\s*,\s*/)));
        resolve();
      });
    });
  }

  license() {
    let default_license = "MIT";

    let self = this;

    return new Promise(function(resolve, reject){
      rl.question(`license (${default_license}): `, function(ans){
        if (ans === "") {
          ans = default_license;
        }

        self.data["license"] = ans;
        resolve();
      });
    });
  }

  homepage() {
    let self = this;

    return new Promise(function(resolve, reject){
      rl.question("homepage: ", function(ans){
        self.data["homepage"] = ans;
        resolve();
      });
    });
  }

  ignore() {
    let self = this;

    return new Promise(function(resolve, reject){
      rl.question(
          "adopt widely used ignore file list setting? [Y/n]",
          function(ans){
            if (ans.match(/^\s*(?:n|no)\s*$/i)) {
              self.data["ignore"] = [];
            }
            else {
              self.data["ignore"] = ["**/.*","bower_components","node_modules","test","tests"];
            }
            resolve();
          });
    });
  }

  makeMainFile() {
    let self = this;

    return new Promise(function(resolve, reject){
      fs.writeFile(`${self.data["name"]}.md`,
          mustache.render(templates.get("main"), self.data),
          function(err){
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
    });
  }

  makeBowerJson() {
    let self = this;

    return new Promise(function(resolve, reject){
      fs.writeFile("bower.json", JSON.stringify(self.data, null, "  "), function(err){
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    }
    );
  }

  makeGitIgnore() {
    if (this.data["ignore"].length < 1) {
      return Promise.resolve("ignore - Skip");
    }

    return new Promise(function(resolve, reject){
      fs.writeFile(
          ".gitignore",
          ["bower_components", "node_modules"].join("\n"),
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
    });
  }

  makeLicense() {
    let licenses = template.get("licenses");
    let license  = licenses.get(this.data["license"]);
    if (!license) {
      return Promise.resolve("license - Skip");
    }

    let self = this;

    return new Promise(function(resolve, reject){
      fs.writeFile("LICENSE", mustache.render(license,
            {"author": self.data["authors"][0] || "", "year": new Date().getFullYear()} ),
          function(err){
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
    });
  }
}

module.exports = Scaffolding;
