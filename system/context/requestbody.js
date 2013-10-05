function RequestBody(ctx) {
    this._read = false;
    this._maxsize = 8192;
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
    return defaultValue;
}

module.exports = RequestBody;