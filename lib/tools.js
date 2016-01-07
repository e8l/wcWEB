"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

const fs = require("fs"),
      os = require("os"),
      path = require("path"),
      spawn = require("child_process").spawnSync;

const ErrorType = {
  SUCCESS: 0,
  INVALID_AGENT: 1,
  UNSUPPORTED: 2,
  SETTINGS_ERRPR: 4,
  EXECUTE_ERROR: 8,
  EXCEPTION: 16
};

let Tools = (function () {
  function Tools(path) {
    _classCallCheck(this, Tools);

    this.settings = JSON.parse(fs.readFileSync(path));
  }

  _createClass(Tools, [{
    key: "compilable",
    value: function compilable(codeType) {
      codeType = codeType.toLowerCase();

      return !!this.settings["compiler"][codeType];
    }
  }, {
    key: "_isObject",
    value: function _isObject(target) {
      return !(!target || typeof target !== "object" || Array.isArray(target));
    }
  }, {
    key: "compile",
    value: function compile(codeType, code) {
      codeType = codeType.toLowerCase();

      let compiler = this.settings["compiler"][codeType];

      let result = this._exec(compiler, code);

      if (result.success) {
        return result.output;
      }

      switch (result.reason) {
        case ErrorType.INVALID_AGENT:
          console.error("[tools.json]");
          console.error(`compiler setting of '${ codeType }' is none or incorrect.`);
          console.error("system does not compile the code.");
          break;
        case ErrorType.UNSUPPORTED:
          console.error("[tools.json]");
          console.error(`none or unknown compiler type '${ compiler.type }'.`);
          console.error("system does not compile the code.");
          break;
        case ErrorType.SETTINGS_ERRPR:
          console.error("[tools.json]");
          console.error("compiler command setting has mistake.");
          console.error("There is no settings or the type is not 'string'.");
          console.error("system does not compile the code.");
          break;
        case ErrorType.EXECUTE_ERROR:
          let detail = result.detail;
          console.error("[compile error]");
          console.error("exit code: " + detail.status);
          console.error(detail.stderr + "\n");

          code = result.stdout || code;
          break;
        case ErrorType.EXCEPTION:
          let error = result.detail;
          console.error("[compile error]");
          console.error(error.message + "\n");
          break;
      }

      return code;
    }
  }, {
    key: "preprocess",
    value: function preprocess(processName, codeType, code) {
      codeType = codeType.toLowerCase();

      if (!this.settings["preprocess"][codeType]) {
        console.error("[tools.json]");
        console.error(`Postprocess setting of '${ codeType }' is none.`);
        console.error("system does not do process.");
        return code;
      }

      let process = this.settings["preprocess"][codeType][processName];

      let result = this._exec(process, code);

      if (result.success) {
        if (process.noUpdate) {
          console.error(`[${ processName }]`);
          console.error(result.output);
          return code;
        } else {
          return result.output;
        }
      }

      switch (result.reason) {
        case ErrorType.INVALID_AGENT:
          console.error("[tools.json]");
          console.error("preprocess setting has mistake.");
          console.error(`There is no settings '${ processName }' of '${ codeType }' or the type is not object.`);
          console.error("system does not do process.");
          break;
        case ErrorType.UNSUPPORTED:
          console.error("[tools.json]");
          console.error(`none or unknown process type '${ process.type }'.`);
          console.error("system does not do process.");
          break;
        case ErrorType.SETTINGS_ERRPR:
          console.error("[tools.json]");
          console.error("process command setting has mistake.");
          console.error("There is no settings or the type is not 'string'.");
          console.error("system does not do process.");
          break;
        case ErrorType.EXECUTE_ERROR:
          let detail = result.detail;
          console.error(`[process error - ${ processName }]`);
          console.error("exit code: " + detail.status);
          console.error(detail.stderr + "\n" + detail.stdout);

          code = result.stdout || code;
          break;
        case ErrorType.EXCEPTION:
          let error = result.detail;
          console.error(`[process error - ${ processName }]`);
          console.error(error.message + "\n");
          break;
      }

      return code;
    }
  }, {
    key: "doCommand",
    value: function doCommand(commandName, fileName) {
      let commands = this.settings["command"];

      let item = commands[commandName];

      if (!this._isObject(item)) {
        console.error("[command error]");
        console.error(`There is no command '${ commandName }'.\n`);
        return false;
      }

      let command = item.command;
      let args = item.option || [];
      if (!item.noArgs) {
        args.push(fileName);
      }

      if (os.platform() === "win32") {
        args = ["/c", [command].concat(args).join(" ")];
        command = "cmd";
      }

      let result = spawn(command, args, { timeout: 60000, encoding: "utf8" });

      if (result.status !== 0 || result.error) {
        console.error(`[command error - ${ commandName }]`);
        console.error("exit code: " + result.status);
        console.error(result.stderr + "\n" + result.stdout);
        return false;
      }

      return true;
    }
  }, {
    key: "_exec",
    value: function _exec(agent, arg) {
      //is object?
      if (!this._isObject(agent)) {
        return { success: false, reason: ErrorType.INVALID_AGENT };
      }

      if (agent.type === "command") {
        return this._execByCommand(agent, arg);
      } else if (agent.type === "module") {
        return this._execByModule(agent, arg);
      } else {
        return { success: false, reason: ErrorType.UNSUPPORTED };
      }
    }
  }, {
    key: "_execByCommand",
    value: function _execByCommand(agent, arg) {
      if (!agent.command || typeof agent.command !== "string") {
        return { success: false, reason: ErrorType.UNSUPPORTED };
      }

      let command = agent.command;
      let option = agent.option || [];
      if (os.platform() === "win32") {
        option = ["/c", [command].concat(option).join(" ")];
        command = "cmd";
      }

      let result = spawn(command, option, { input: arg, timeout: 60000, encoding: "utf8" });

      if (result.status !== 0 || result.error) {
        return {
          success: false,
          reason: ErrorType.EXECUTE_ERROR,
          detail: result
        };
      } else {
        return {
          success: true,
          reason: ErrorType.SUCCESS,
          output: result.stdout.toString(),
          detail: result
        };
      }
    }
  }, {
    key: "_execByModule",
    value: function _execByModule(agent, arg) {
      if (!agent.module || typeof agent.module !== "string") {
        return { success: false, reason: ErrorType.UNSUPPORTED };
      }

      try {
        let modPath = agent.module;

        if (!path.isAbsolute(modPath)) {
          modPath = path.join(__dirname, "../config", modPath);
        }

        let mod = require(modPath);

        let output = mod(arg);

        return {
          success: true,
          reason: ErrorType.SUCCESS,
          output: output
        };
      } catch (e) {
        return {
          success: false,
          reason: ErrorType.EXCEPTION,
          detail: e
        };
      }
    }
  }]);

  return Tools;
})();

const SETTING_PATH = path.join(__dirname, "../config/tools.json");
var instance = new Tools(SETTING_PATH);

module.exports = instance;