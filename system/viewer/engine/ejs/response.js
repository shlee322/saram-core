var Response = require('../../../context/response.js');
var Header = require('../../../context/header.js');
var HttpResponse = require('../../../protocol/modules/http/response.js');

function EjsRespone(res, viewer) {
    Response.apply(this);
    this._viewer = viewer;
    this._raw = res;
}

EjsRespone.prototype.send = function (data, header) {
    var html = this._viewer(data);

    if(this._raw instanceof HttpResponse) {
        this._raw.send(html, new Header.Header([[Header.Key.CONTENT_TYPE, "text/html"]]));
        return;
    }
    this._raw.send(html, header);
}

EjsRespone.prototype.error = function (data, header) {
    this._raw.error(data, header);
}

EjsRespone.prototype.__proto__ = Response.prototype;
module.exports = EjsRespone;
