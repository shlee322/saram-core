var RequestBody = require('../context/requestbody.js');

function CallRequestBody(ctx, data) {
    RequestBody.apply(this, [ctx]);

    this._ctx = ctx;
    this._data = data;
}

CallRequestBody.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

CallRequestBody.prototype.readBody = function (cb) {
    cb();
}

CallRequestBody.prototype.__proto__ = RequestBody.prototype;
module.exports = CallRequestBody;
