var querystring = require('querystring');
var Data = require('../context/data.js');

function CallData(ctx, data) {
    Data.apply(this, [ctx]);

    this._ctx = ctx;
    this._data = data;

}

CallData.prototype.readKeyRoutine = function (keys, callback) {
    this._ctx.run(callback);
}

CallData.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

CallData.prototype.__proto__ = Data.prototype;
module.exports = CallData;
