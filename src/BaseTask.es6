"use strict";

class BaseTask {
  constructor(selector, metadata={}){
    this.target = "Target Section Title";
    this.selector = selector;
    this.metadata = metadata;
    this.section = undefined;
  }

  exec() {
    this.section = this.selector.getSection(this.target);

    if (this.section && this.section.length > 0) {
      this.task();
    }
    else {
      this.alternativeTask();
    }

    return this.result();
  }

  task() {
    // do task
  }
  
  alternativeTask() {
    // do alternative task when target section was empty or did not exist.
  }

  result() {
    // return task's output
    return undefined;
  }
}

module.exports = BaseTask;