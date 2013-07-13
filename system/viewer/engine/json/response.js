var Response = require('../../../context/response.js');

function JsonRespone(res) {
    Response.apply(this);
    this._raw = res;
}

JsonRespone.prototype.send = function (data, header) {
    this._raw.send(data, header);
}

JsonRespone.prototype.error = function (data, header) {
    this._raw.error(data, header);
}

JsonRespone.prototype.__proto__ = Response.prototype;
module.exports = JsonRespone;
