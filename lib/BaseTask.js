"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

let BaseTask = (function () {
  function BaseTask(selector) {
    let metadata = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, BaseTask);

    this.target = "Target Section Title";
    this.selector = selector;
    this.metadata = metadata;
    this.section = undefined;
  }

  _createClass(BaseTask, [{
    key: "exec",
    value: function exec() {
      this.section = this.selector.getSection(this.target);

      if (this.section && this.section.length > 0) {
        this.task();
      } else {
        this.alternativeTask();
      }

      return this.result();
    }
  }, {
    key: "task",
    value: function task() {
      // do task
    }
  }, {
    key: "alternativeTask",
    value: function alternativeTask() {
      // do alternative task when target section was empty or did not exist.
    }
  }, {
    key: "result",
    value: function result() {
      // return task's output
      return undefined;
    }
  }]);

  return BaseTask;
})();

module.exports = BaseTask;