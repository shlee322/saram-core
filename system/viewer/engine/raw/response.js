var Response = require('../../../context/response.js');

function RawRespone(res) {
    Response.apply(this);
    this._raw = res;
}

RawRespone.prototype.send = function (data) {
    this._raw.send(data);
}

RawRespone.prototype.error = function (data) {
    this._raw.error(JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

RawRespone.prototype.__proto__ = Response.prototype;
module.exports = RawRespone;
