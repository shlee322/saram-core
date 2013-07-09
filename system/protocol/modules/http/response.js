var url = require('url');
var querystring = require('querystring');
var Response = require('../../../context/response.js');

var SERVER = "saram.elab.kr/" + require('../../../../package.json').version;

function HttpResponse(res) {
    Response.apply(this);

    this._raw = res;
}

HttpResponse.prototype.send = function (data) {
    this._raw.writeHead(200, {"Server":SERVER, "Content-Type": "application/json; charset=utf-8"});
    this._raw.end(data);
}

HttpResponse.prototype.error = function (data) {
    this._raw.writeHead(501, {"Server":SERVER, "Content-Type": "application/json; charset=utf-8"});
    this._raw.end(typeof data == "string" ? data : JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

HttpResponse.prototype.__proto__ = Response.prototype;
module.exports = HttpResponse;