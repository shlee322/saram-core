function Param(data) {
    this._data = {};

    if(data) {
        for(var i in data) {
            var d = data[i];
            this.set(d[0], d[1], d[2]);
        }
    }
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
