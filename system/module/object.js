var Bundle = require('./bundle.js');

function ModuleObject(content, mid) {
    var _this = this;
    this.__proto__.__proto__ = content;
    this._mid = mid;
    this._event = {};
    this.actions = new Object();
    this.actions.__proto__ = content.actions;
    this.pipes = new Array();
    this.pipes.__proto__ = content.pipes;

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

module.exports = ModuleObject;
