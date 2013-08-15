var Module = require('./index.js');
var Bundle = require('./bundle.js');
var Doc = require('../doc/index.js');

function ModuleObject(content, mid) {
    var _this = this;
    this.__proto__.__proto__ = content;
    this._mid = mid;
    this._event = {};
    this.actions = new Object();
    this.actions.__proto__ = content.actions;
    this.pipes = new Array();
    this.pipes.__proto__ = content.pipes;

    this.doc = new Doc(content.doc);
    this.manager = new Object();
    this.manager.__proto__ = content.manager;

    this._bundle = new Bundle(this);

    this._dbTable = {};
    this._dbQuery = {};
}

ModuleObject.prototype.getMid = function () {
    return this._mid;
}

ModuleObject.prototype.getBundle = function () {
    return this._bundle;
}

ModuleObject.prototype.event = function (name, callback) {
    //Content 생성 후 진행
}

ModuleObject.prototype.setSkin = function (dir) {
    if(this._skin == dir)
        return;

    this._skin = dir;
}

ModuleObject.prototype.getSkin = function () {
    return this._skin;
}

ModuleObject.prototype.addAction = function (name, func) {
    this.actions[name] = func;
}

ModuleObject.prototype.addPipe = function (pipe) {
    Module.initPipe(pipe);
    this.pipes.push(pipe);
    this._bundle.addPipe(pipe);
}

ModuleObject.prototype.addReceiver = function (event, module, action) {
    var e = this._event[event];
    if(!e) {
        e = [];
        this._event[event] = e;
    }
    e.push({module:module, action:action});
}

module.exports = ModuleObject;
