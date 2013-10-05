var Response = require('../context/response.js');

function CallResponse(ctx, pernet, callback) {
    Response.apply(this, [ctx]);

    this._pernet = pernet;
    this._callback = callback;
}

CallResponse.prototype.sendResponse = function () {
    var root = this._data.pop();
    root._stack = this._data;
    this._callback(root);
}

CallResponse.prototype.__proto__ = Response.prototype;
module.exports = CallResponse;
