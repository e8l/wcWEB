"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const fs = require("fs"),
      mustache = require("mustache"),
      path = require("path");

const BaseTask = require("../BaseTask.js"),
      templates = require("../templates.js");

let Links = (function (_BaseTask) {
  _inherits(Links, _BaseTask);

  function Links(selector, metadata) {
    _classCallCheck(this, Links);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Links).call(this, selector, metadata));

    _this.links = [];
    return _this;
  }

  _createClass(Links, [{
    key: "exec",
    value: function exec() {
      if (this.metadata.load) {
        this.task();
      }

      return this.result();
    }
  }, {
    key: "task",
    value: function task() {
      for (let lib of this.metadata.load) {
        let libPath = path.join(this.metadata.__dirname, lib);

        try {
          let stat = fs.statSync(libPath);

          // for example, lib's value is 'bower_components/hoge/main.js'
          if (stat.isFile()) {
            this._addFilePath(lib);
          }
          // for example, lib's value is 'bower_components/hoge'
          else if (stat.isDirectory()) {
              this._addBowerComponents(bowerPath);
            }

          continue;
        } catch (e) {
          // not exist or access denied.
        }

        try {

          libPath = path.join(this.metadata.__dirname, "bower_components", lib);
          let stat = fs.statSync(libPath);

          // for example, lib's value is 'hoge/main.js'
          if (stat.isFile()) {
            this._addFilePath(path.join("bower_components", lib));
          }
          // for example, lib's value is 'hoge'
          else if (stat.isDirectory()) {
              this._addBowerComponents(libPath);
            }

          continue;
        } catch (e) {
          // not exist or access denied.
        }

        console.log(`[Warn] Cannot access library "${ lib }".`);
        this._addPath(lib);
      }
    }
  }, {
    key: "_addPath",
    value: function _addPath(fpath) {
      this.links.push(fpath.replace(new RegExp("\\" + path.sep, "g"), "/"));
    }
  }, {
    key: "_addFilePath",
    value: function _addFilePath(lib) {
      let extname = path.extname(lib).toLowerCase();
      if (extname === ".html" || extname === "htm") {
        this._addPath(path.relative(this.metadata.__dirname, lib));
      } else if (extname === ".js") {
        this._addPath(this._createWrapper(lib));
      } else {
        console.error("[Linker Error]");
        console.error(`'${ lib }' is not supported file type.`);
      }
    }
  }, {
    key: "_addBowerComponents",
    value: function _addBowerComponents(libPath) {
      let bowerJsonPath = path.join(libPath, "bower.json");
      try {
        let bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));

        let mainFiles = bowerJson.main;

        if (!mainFiles) {
          return;
        }

        if (Array.isArray(mainFiles)) {
          // Array of String
          for (let file of mainFiles) {
            this._addFilePath(path.join(libPath, file));
          }
        } else {
          // String
          this._addFilePath(path.join(libPath, mainFiles));
        }

        return;
      } catch (e) {
        // not exist or access denied.
        console.log(`[Warn] Cannot access bower.json in "${ libPath }".`);
      }
      console.log(`[Warn] Cannot access library "${ libPath }".`);
      this._addPath(libPath);
    }
  }, {
    key: "_createWrapper",
    value: function _createWrapper(lib) {
      let wrapperDirName = "wrapper";
      let wrapperDirPath = path.join(this.metadata.__dirname, wrapperDirName);

      let bExist = false;
      try {
        fs.statSync(wrapperDirPath);
        bExist = true;
      } catch (e) {}

      if (!bExist) {
        try {
          fs.mkdir(wrapperDirPath, 493 /* =0755 */);
        } catch (e) {
          console.error("[Linker Error]");
          console.error(`cannot make wrapper directory '${ wrapperDirPath }'`);
          return lib;
        }
      }

      let jsPath = path.relative(wrapperDirPath, path.join(this.metadata.__dirname, lib));
      let wrapperHtml = mustache.render(templates.get("wrapper"), { path: jsPath });

      let basename = path.basename(lib);
      basename = basename.slice(0, basename.lastIndexOf(path.extname(basename)));
      let wrapperPath = path.join(wrapperDirPath, `${ basename }.html`);

      try {
        fs.writeFileSync(wrapperPath, wrapperHtml, "utf8");
      } catch (e) {
        console.error("[Linker Error]");
        console.error(`cannot make wrapper '${ wrapperPath }'`);
        return lib;
      }

      return path.relative(this.metadata.__dirname, wrapperPath);
    }
  }, {
    key: "result",
    value: function result() {
      return this.links;
    }
  }]);

  return Links;
})(BaseTask);

module.exports = Links;