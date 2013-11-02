var Log = require('../../../log/index.js');
var querystring = require('querystring');
var RequestBody = require('../../../context/requestbody.js');

function HttpRequestBody(ctx, req) {
    RequestBody.apply(this, [ctx]);

    this._ctx = ctx;
    this._req = req;
    this._type = this._req.headers['content-type'];
    this._size = parseInt(this._req.headers['content-length']);
    this._buf = "";
}

HttpRequestBody.prototype.readBody = function (cb) {
    if(this._read || this._size > this._maxsize) {
        if(cb) {
            cb();
        }
        return;
    }

    var _this = this;
    this._req.on('data', function (chunk) {
        _this._buf += chunk.toString('utf8');
    });

    this._req.on('end', function () {
        _this._read = true;
        _this.parseData(cb);
    });
}

HttpRequestBody.prototype.parseData = function (cb) {
    var type = this._type;

    if(!type) {
        type = "application/x-www-form-urlencoded";
    }

    var index = type.indexOf(";");
    if(index != -1) {
        type = type.substring(0, index);
    }

    if(type == "application/x-www-form-urlencoded") {
        this._data = querystring.parse(this._buf);
        this._buf = null;
    } else {
        Log.warning(this._ctx, "지정되지 않은 Content Type - " + type);
    }
    cb();
}

HttpRequestBody.prototype.__proto__ = RequestBody.prototype;
module.exports = HttpRequestBody;
