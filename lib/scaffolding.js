"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const mustache = require("mustache"),
      path = require("path"),
      fs = require("fs"),
      co = require("co"),
      rl = require("readline").createInterface(process.stdin, process.stdout);

const templates = require("./templates.js");

let Scaffolding = (function () {
  function Scaffolding() {
    _classCallCheck(this, Scaffolding);

    this.data = {
      "dependencies": {
        "webcomponentsjs": ">=0.7.7 <1.0.0",
        "polymer": ">=1.0.8 <2.0.0"
      }
    };
  }

  _createClass(Scaffolding, [{
    key: "run",
    value: function run() {
      let self = this;
      co(function* () {
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
        yield [self.makeMainFile(), self.makeBowerJson(), self.makeGitIgnore(), self.makeLicense()];

        rl.close();
      }).catch(err => {
        throw err;
      });
    }
  }, {
    key: "name",
    value: function name() {
      let current_dir = path.basename(path.resolve("."));

      let default_name = "my-web-component";
      let reg = current_dir.match(/^[A-Za-z][A-Za-z0-9_]*(?:\-[A-Za-z0-9_]+)+$/);
      if (reg) {
        default_name = reg[0].toLowerCase();
      } else if (reg = current_dir.match(/^[A-Za-z][A-Za-z0-9_]*$/)) {
        default_name = reg[0].toLowerCase() + "-element";
      }

      let self = this;
      let loop = function (resolve, reject) {
        rl.question(`name (${ default_name }): `, function (ans) {
          if (ans.match(/^[A-Za-z][A-Za-z0-9_]*(?:\-[A-Za-z0-9_]+)+$/)) {
            self.data["name"] = ans;
            resolve();
            return;
          } else if (ans === "") {
            self.data["name"] = default_name;
            resolve();
            return;
          }
          console.log("[error] invalid web component name!");
          loop(resolve, reject);
        });
      };

      return new Promise(loop);
    }
  }, {
    key: "version",
    value: function version() {
      let default_version = "0.0.0";

      let self = this;
      let loop = function (resolve, reject) {
        rl.question(`version (${ default_version }): `, function (ans) {
          if (ans.match(/^(?:\d|[1-9]\d+)\.(?:\d|[1-9]\d+)\.(?:\d|[1-9]\d+)(?:\-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/)) {
            self.data["version"] = ans;
            resolve();
            return;
          } else if (ans === "") {
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
  }, {
    key: "description",
    value: function description() {
      let self = this;;

      return new Promise(function (resolve, reject) {
        rl.question("description: ", function (ans) {
          self.data["description"] = ans;
          resolve();
        });
      });
    }
  }, {
    key: "keywords",
    value: function keywords() {
      let self = this;

      return new Promise(function (resolve, reject) {
        rl.question("keywords (Comma-separated): ", function (ans) {
          let keywords = ans.split(/\s*,\s*/).concat(["Polymer", "web-components"]);
          self.data["keywords"] = Array.from(new Set(keywords));
          resolve();
        });
      });
    }
  }, {
    key: "authors",
    value: function authors() {
      let self = this;

      return new Promise(function (resolve, reject) {
        rl.question("authors (Comma-separated): ", function (ans) {
          self.data["authors"] = Array.from(new Set(ans.split(/\s*,\s*/)));
          resolve();
        });
      });
    }
  }, {
    key: "license",
    value: function license() {
      let default_license = "MIT";

      let self = this;

      return new Promise(function (resolve, reject) {
        rl.question(`license (${ default_license }): `, function (ans) {
          if (ans === "") {
            ans = default_license;
          }

          self.data["license"] = ans;
          resolve();
        });
      });
    }
  }, {
    key: "homepage",
    value: function homepage() {
      let self = this;

      return new Promise(function (resolve, reject) {
        rl.question("homepage: ", function (ans) {
          self.data["homepage"] = ans;
          resolve();
        });
      });
    }
  }, {
    key: "ignore",
    value: function ignore() {
      let self = this;

      return new Promise(function (resolve, reject) {
        rl.question("adopt widely used ignore file list setting? [Y/n]", function (ans) {
          if (ans.match(/^\s*(?:n|no)\s*$/i)) {
            self.data["ignore"] = [];
          } else {
            self.data["ignore"] = ["**/.*", "bower_components", "node_modules", "test", "tests"];
          }
          resolve();
        });
      });
    }
  }, {
    key: "makeMainFile",
    value: function makeMainFile() {
      let self = this;

      return new Promise(function (resolve, reject) {
        fs.writeFile(`${ self.data["name"] }.md`, mustache.render(templates.get("main"), self.data), function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  }, {
    key: "makeBowerJson",
    value: function makeBowerJson() {
      let self = this;

      return new Promise(function (resolve, reject) {
        fs.writeFile("bower.json", JSON.stringify(self.data, null, "  "), function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  }, {
    key: "makeGitIgnore",
    value: function makeGitIgnore() {
      if (this.data["ignore"].length < 1) {
        return Promise.resolve("ignore - Skip");
      }

      return new Promise(function (resolve, reject) {
        fs.writeFile(".gitignore", ["bower_components", "node_modules"].join("\n"), function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  }, {
    key: "makeLicense",
    value: function makeLicense() {
      let licenses = template.get("licenses");
      let license = licenses.get(this.data["license"]);
      if (!license) {
        return Promise.resolve("license - Skip");
      }

      let self = this;

      return new Promise(function (resolve, reject) {
        fs.writeFile("LICENSE", mustache.render(license, { "author": self.data["authors"][0] || "", "year": new Date().getFullYear() }), function (err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    }
  }]);

  return Scaffolding;
})();

module.exports = Scaffolding;