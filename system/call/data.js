var querystring = require('querystring');
var Data = require('../context/data.js');

function CallData(data) {
    Data.apply(this);

    this._data = data;

}

CallData.prototype.readKeyRoutine = function (keys, callback) {
    callback();
}

CallData.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

CallData.prototype.__proto__ = Data.prototype;
module.exports = CallData;