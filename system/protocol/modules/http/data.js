var querystring = require('querystring');
var Data = require('../../../context/data.js');

function HttpData(req) {
    Data.apply(this);

    this._req = req;
    this._data = "";

}

HttpData.prototype.readKeyRoutine = function (keys, callback) {
    var _this = this;

    this._req.on('data', function (chunk) {
        _this._data += chunk;
    });

    this._req.on('end', function () {
        _this._data = querystring.parse(_this._data);
        callback();
    });
}

HttpData.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

HttpData.prototype.__proto__ = Data.prototype;
module.exports = HttpData;
