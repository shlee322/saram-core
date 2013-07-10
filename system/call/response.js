var Response = require('../context/response.js');

function CallResponse(pernet, callback) {
    Response.apply(this);

    this._pernet = pernet;
    this._callback = callback;
}

CallResponse.prototype.send = function (data) {
    this._callback(data);
}

CallResponse.prototype.error = function (data) {
    this._callback(data);
}

CallResponse.prototype.__proto__ = Response.prototype;
module.exports = CallResponse;
