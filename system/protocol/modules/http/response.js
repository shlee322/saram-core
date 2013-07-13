var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var Response = require('../../../context/response.js');
var Header = require('../../../context/header.js');
var ResponseCode = require('./responsecode.js');

var SERVER = "saram.elab.kr/" + require('../../../../package.json').version;

function HttpResponse(ctx, res) {
    Response.apply(this, [ctx]);

    this._raw = res;
}

HttpResponse.prototype.send = function (data, header) {
    if(!header)
        header = new Header.Header();

    this._raw.writeHead(
        header.get(Header.Key.RESPONSE_CODE, 200),
        {
            "Server":SERVER,
            "Content-Type": header.get(Header.Key.CONTENT_TYPE, 'application/json; charset=utf-8;')
        }
    );

    if(data instanceof fs.ReadStream) {
        var _this = this;
        data.on("data",function(d){
            _this._raw.write(d, 'binary');
        });
        data.on("end",function(){
            _this._raw.end();
        });

        return;
    }

    if(data instanceof Object) {
        data = JSON.stringify(data);
    }

    this._raw.end(data);
}

HttpResponse.prototype.error = function (data, header) {
    if(!header)
        header = new Header.Header();

    if(data instanceof ResponseCode.Response)
        header.set(Header.Key.RESPONSE_CODE, data.responseCode);

    this._raw.writeHead(
        header.get(Header.Key.RESPONSE_CODE, 501),
        {
            "Server":SERVER,
            "Content-Type": header.get(Header.Key.CONTENT_TYPE, 'application/json; charset=utf-8;')
        }
    );
    this._raw.end(typeof data == "string" ? data : JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

HttpResponse.prototype.__proto__ = Response.prototype;
module.exports = HttpResponse;
