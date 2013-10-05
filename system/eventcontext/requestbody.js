var RequestBody = require('../context/requestbody.js');

function EventRequestBody(ctx, data) {
    RequestBody.apply(this, [ctx]);

    this._ctx = ctx;
    this._data = data;
}

EventRequestBody.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

EventRequestBody.prototype.readBody = function (cb) {
    cb();
}

EventRequestBody.prototype.__proto__ = RequestBody.prototype;
module.exports = EventRequestBody;
