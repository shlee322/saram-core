var url = require('url');
var querystring = require('querystring');
var Request = require('../../../context/request.js');
var Header = require('../../../context/header/header.js');
var HttpData = require('./data.js');
var HttpRequestBody = require('./requestbody.js');

function HttpRequest(ctx, req) {
    Request.apply(this, [ctx]);

    var method = req.method.toLowerCase();
    if(method != "get" && method != "post" && method != "put" && method != "delete")
        method = "get";

    this.method = method;
    this._raw = req;
    this.sender = { type:"http" };
    //this.header = new Header(req.headers);
    this.url = url.parse(req.url, true);
    this.query = this.url.query;
    this.path = this.url.pathname;
    this.headers = new Header.Header(this._raw.headers);
    this.body = new HttpRequestBody(ctx, this._raw);
}

HttpRequest.prototype.__proto__ = Request.prototype;

module.exports = HttpRequest;
