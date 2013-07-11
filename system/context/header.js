function Header(data) {
    this._data = {};

    if(data) {
        for(var i in data) {
            this._data[data[i][0]] = data[i][1];
        }
    }
}

Header.prototype.set = function (key, value) {
    this._data[key] = value;
}

Header.prototype.get = function (key, _default) {
    var value = this._data[key];
    return value ? value : _default;
}

exports.Header = Header;

exports.Key = {};
exports.Key.RESPONSE_CODE = "code";
exports.Key.CONTENT_TYPE = "Content-Type";

exports.Value = {};
exports.Value.RESPONSE_CODE = {};
exports.Value.RESPONSE_CODE.OK = "200";