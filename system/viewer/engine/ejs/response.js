var Response = require('../../../context/response.js');

function EjsRespone(res, viewer) {
    Response.apply(this);
    this._viewer = viewer;
    this._raw = res;
}

EjsRespone.prototype.send = function (data) {
    this._raw.send(this._viewer(data));
}

EjsRespone.prototype.error = function (data) {
    this._raw.error(JSON.stringify({error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}}));
}

EjsRespone.prototype.__proto__ = Response.prototype;
module.exports = EjsRespone;