var Bundle = require('./bundle.js');

function initStaticModule(ctx) {
    var _this = this;
    this._bundle = new Bundle(this);
    this._content = {};
    this.addFile = function (path, file) {
        _this._content[path] = file;
    }
}

module.exports = initStaticModule;