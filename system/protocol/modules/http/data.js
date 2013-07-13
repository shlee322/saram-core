var querystring = require('querystring');
var Data = require('../../../context/data.js');

function HttpData(ctx, req) {
    Data.apply(this, [ctx]);

    this._ctx = ctx;
    this._req = req;
}

HttpData.prototype.readKeyRoutine = function (keys, callback) {
    var _this = this;

    var data = "";

    this._req.on('data', function (chunk) {
        data += chunk.toString('utf8');
    });

    this._req.on('end', function () {
        data = querystring.parse(data);
        _this._data = data;
        _this._ctx.run(callback);
    });
}

HttpData.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

HttpData.prototype.__proto__ = Data.prototype;
module.exports = HttpData;
