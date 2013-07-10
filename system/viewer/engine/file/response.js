var fs = require('fs');
var path = require('path');
var Response = require('../../../context/response.js');
var mime = require('./mime.json');

function FileRespone(res) {
    Response.apply(this);
    this._raw = res;
}

FileRespone.prototype.send = function (file) {
    var ex = path.extname(file);
    var type = mime[ex];
    if(!mime[ex])
        type = 'application/octet-stream';
    this._raw.send(fs.createReadStream(file), type);
}

FileRespone.prototype.error = function (data) {
    this._raw.error(JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

FileRespone.prototype.__proto__ = Response.prototype;
module.exports = FileRespone;
