var Bundle = require('./bundle.js');

function initStaticModule(ctx) {
    var _this = this;
    this._bundle = new Bundle(this);
    this._content = {};
    this._dirs = {};
    this.addFile = function (path, file) {
        _this._content[path] = file;
    }
    this.addDir = function (path, dir) {
        _this._dirs[path] = dir;
    }
}

module.exports = initStaticModule;