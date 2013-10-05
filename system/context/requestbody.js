function RequestBody(ctx) {
    this._read = false;
    this._maxsize = 8192;
    this._data = {};
    this._expandedData = {};
}

RequestBody.prototype.isRead = function () {
    return this._read;
}

RequestBody.prototype.setMaxSize = function (size, cb) {
    if(!size || this._maxsize > size)
    {
        if(cb) {
            cb();
        }
        return;
    }

    this._maxsize = size;
    this.readBody(cb);
}

RequestBody.prototype.readBody = function (cb) {
    cb();
}

RequestBody.prototype.getValue = function (key, defaultValue) {
    if(this._expandedData[key]) {
        return this._expandedData[key];
    }

    var val = this._data[key];
    return val ? val : defaultValue;
}

RequestBody.prototype.setValue = function (key, value) {
    this._expandedData[key] = value;
}

module.exports = RequestBody;