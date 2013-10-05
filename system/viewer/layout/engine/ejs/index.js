var fs = require('fs');
var ejs = require('ejs');

function EjsEngine(file) {
    var data = fs.readFileSync(file, 'utf8');
    this.viewer = ejs.compile(data);
}

EjsEngine.prototype.render = function (data, cb) {
    cb(this.viewer(data));
}

module.exports = EjsEngine;