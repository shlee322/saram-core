var Data = require('../context/data.js');

function EventData(data) {
    Data.apply(this);

    this._data = data;
}

EventData.prototype.readKeyRoutine = function (keys, callback) {
    callback();
}

EventData.prototype.getValue = function (key, defaultValue) {
    var val = this._data[key];
    return val ? val : defaultValue;
}

EventData.prototype.__proto__ = Data.prototype;
module.exports = EventData;