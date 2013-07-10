var Response = require('../../../context/response.js');
var HttpResponse = require('../../../protocol/modules/http/response.js');

function EjsRespone(res, viewer) {
    Response.apply(this);
    this._viewer = viewer;
    this._raw = res;
}

EjsRespone.prototype.send = function (data) {
    var html = this._viewer(data);

    if(this._raw instanceof HttpResponse) {
        this._raw.send(html, "text/html");
        return;
    }
    this._raw.send(html);
}

EjsRespone.prototype.error = function (data) {
    this._raw.error(JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

EjsRespone.prototype.__proto__ = Response.prototype;
module.exports = EjsRespone;
