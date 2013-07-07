function Param() {
    this._data = {};
}

Param.prototype.set = function(mid, key, value) {
    checkValue(value);

    if(!this._data[mid])
        this._data[mid] = {};
    this._data[mid][key] = value;
}

Param.prototype.get = function(mid, key) {
    return this._data[mid] ? this._data[mid][key] : undefined;
}

var checkReg = /^[0-9A-Fa-f]+$/;
function checkValue(value) {
    if(!value.match(checkReg)) {
        throw "Error HEX - value:" + value;
    }
}

module.exports = Param;