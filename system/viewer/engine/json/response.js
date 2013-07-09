var Response = require('../../../context/response.js');

function JsonRespone(res) {
    Response.apply(this);
    this._raw = res;
}

JsonRespone.prototype.send = function (data) {
    this._raw.send(JSON.stringify(data));
}

JsonRespone.prototype.error = function (data) {
    this._raw.error(JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

JsonRespone.prototype.__proto__ = Response.prototype;
module.exports = JsonRespone;