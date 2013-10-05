var JsonViewer = require('../viewer/json/index.js');

function Response(ctx) {
    this._ctx = ctx;
    this._data = [];

    this._headers = {};

    this.setStatus(200);
    this.setContentType("application/json; charset=utf-8;");
}

Response.prototype.send = function (data, viewer) {
    if(!viewer)
        viewer = JsonViewer;

    this._data.push({module:this._ctx.current.module, viewer:viewer, data:data});
}

Response.prototype.error = function (data) {
    var error = typeof data == "string" ? data : {error:{mid:data.mid, code:data.code, message:data.message, stack:data.stack}};
    this.setStatus(500);
    this._data.push({module:this._ctx.getSaram().getCoreModule(), viewer:JsonViewer, data:error});
    this.sendResponse();
}

Response.prototype.getStatus = function () {
    return this.status;
}

Response.prototype.setStatus = function (code) {
    this.status = code;
}

Response.prototype.getContentType = function () {
    return this.contentType;
}

Response.prototype.setContentType = function (contentType) {
    this.contentType = contentType;
}

Response.prototype.getHeader = function (name) {
    return this._headers[name]
}

Response.prototype.setHeader = function (name, value) {
    this._headers[name] = value;
}

Response.prototype.sendResponse = function () {
    if(this.getStatus()>=400) {
        var root = this._data.pop();
        root._stack = this._data;
        throw root.data.error;
    }
}


module.exports = Response;
