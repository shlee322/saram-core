var fs = require('fs');
var path = require('path');
var Response = require('../../../context/response.js');
var Header = require('../../../context/header.js');
var mime = require('./mime.json');

function FileRespone(res) {
    Response.apply(this);
    this._raw = res;
}

FileRespone.prototype.send = function (file, header) {
    if(!header)
        header = new Header.Header();
    var ex = path.extname(file);
    var type = mime[ex];
    header.set(Header.Key.CONTENT_TYPE, type ? type : 'application/octet-stream');
    this._raw.send(fs.createReadStream(file), header);
}

FileRespone.prototype.error = function (data, header) {
    this._raw.error(data, header);
}

FileRespone.prototype.__proto__ = Response.prototype;
module.exports = FileRespone;
