"use strict";

const fs = require("fs"),
      mustache = require("mustache"),
      path = require("path");

const BaseTask = require("../BaseTask.js"),
      templates = require("../templates.js");

class Links extends BaseTask {
  constructor(selector, metadata){
    super(selector, metadata);
    this.links = [];
  }

  exec() {
   if (this.metadata.load) {
     this.task();
   }
   
    return this.result();
  }

  task() {
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
      }
      catch(e){
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
      }
      catch(e){
        // not exist or access denied.
      }
      
      console.log(`[Warn] Cannot access library "${lib}".`);
      this._addPath(lib);
    }
  }
  
  _addPath(fpath) {
    this.links.push(fpath.replace(new RegExp("\\"+path.sep, "g"), "/"));
  }
  
  _addFilePath(lib) {
    let extname = path.extname(lib).toLowerCase();
    if (extname === ".html" || extname === "htm") {
      this._addPath(path.relative(this.metadata.__dirname, lib));
    }
    else if (extname === ".js") {
      this._addPath(this._createWrapper(lib));
    }
    else {
      console.error("[Linker Error]");
      console.error(`'${lib}' is not supported file type.`);
    }
  }
  
  _addBowerComponents(libPath) {
    let bowerJsonPath = path.join(libPath, "bower.json");
    try {
      let bowerJson = JSON.parse(fs.readFileSync(bowerJsonPath));
      
      let mainFiles = bowerJson.main;
      
      if (!mainFiles) {
        return;
      }
      
      if (Array.isArray(mainFiles)) { // Array of String
        for (let file of mainFiles) {
          this._addFilePath(path.join(libPath, file));
        }
      }
      else { // String
        this._addFilePath(path.join(libPath, mainFiles));
      }
      
      return;
    }
    catch(e) { // not exist or access denied.
      console.log(`[Warn] Cannot access bower.json in "${libPath}".`);
    }
    console.log(`[Warn] Cannot access library "${libPath}".`);
    this._addPath(libPath);
  }
  
  _createWrapper(lib) {
    let wrapperDirName = "wrapper";
    let wrapperDirPath = path.join(this.metadata.__dirname, wrapperDirName);
    
    let bExist = false
    try {
      fs.statSync(wrapperDirPath);
      bExist = true;
    }catch(e) {}
    
    if (!bExist) {
      try {
        fs.mkdir(wrapperDirPath, 493/* =0755 */);
      }
      catch (e) {
        console.error("[Linker Error]");
        console.error(`cannot make wrapper directory '${wrapperDirPath}'`);
        return lib;
      }
    }
    
    let jsPath = path.relative(wrapperDirPath, path.join(this.metadata.__dirname, lib));
    let wrapperHtml = mustache.render(templates.get("wrapper"), {path: jsPath});
    
    let basename = path.basename(lib);
    basename = basename.slice(0, basename.lastIndexOf(path.extname(basename)));
    let wrapperPath = path.join(wrapperDirPath, `${basename}.html`);
    
    try {
      fs.writeFileSync(wrapperPath, wrapperHtml, "utf8");
    }
    catch(e) {
      console.error("[Linker Error]");
      console.error(`cannot make wrapper '${wrapperPath}'`);
      return lib;
    }
    
    return path.relative(this.metadata.__dirname, wrapperPath);
  }

  result() {
    return this.links;
  }
}

module.exports = Links;