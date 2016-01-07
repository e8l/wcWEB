"use strict";

const BaseTask = require("../BaseTask.js");

class Test extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.target = "test";
    this.testList = [];
  }
  
  task(){
    let header = this.section[0].prevElem;
    let level = header.level + 1;
    let eachTests = this.section.filter( function(elm, idx, arr){
                      return elm.type === "Header" && elm.level === level;
                    });
    
    for (let test of eachTests) {
      let subSection = this.selector.getSection(test.text, this.section);
      if (subSection.length === 0) {
        continue;
      }
      
      let testData = {};
      testData.testName = test.text;
      
      let testCodes = subSection.filter( function(elm, idx, arr){
                        return elm.type === "CodeBlock";
                      });
      let code = "";
      for (let frag of testCodes) {
        code += `${frag.content}\n`;
      }
      code = code.split("\n").join("\n        ");
      
      testData.testCode = code;
      this.testList.push(testData);
    }
    
    header.suicide();
    for (let elm of this.section) {
      elm.suicide();
    }
  }
  
  result(){
    return this.testList;
  }
}

module.exports = Test;