var url = require('url');
var querystring = require('querystring');
var Request = require('../../../context/request.js');
var HttpData = require('./data.js');

function HttpRequest(ctx, req) {
    Request.apply(this, [ctx]);

    var method = req.method.toLowerCase();
    if(method != "get" && method != "post" && method != "put" && method != "delete")
        method = "get";

    this.method = method;
    this._raw = req;
    this.sender = { type:"http" };
    this.url = url.parse(req.url, true);
    this.query = this.url.query;
    this.path = this.url.pathname;
    this.data = new HttpData(ctx, this._raw);
}

HttpRequest.prototype.__proto__ = Request.prototype;

module.exports = HttpRequest;
