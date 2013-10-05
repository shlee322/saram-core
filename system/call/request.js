var url = require('url');
var querystring = require('querystring');
var Request = require('../context/request.js');
var CallRequestBody = require('./requestbody.js');

function CallRequest(ctx, method, path, data) {
    Request.apply(this, [ctx]);

    this.sender = { type:"server", name:"local", direct:false };
    this.method = method;
    this.path = path;
    this.query = data.query ? data.query : {};
    this.body = new CallRequestBody(ctx, data.body ? data.body : data.data);

    if(data.param) {
        for(var i in data.param._data) {
            ctx.param._data[i] = {};
            for(var key in data.param._data[i]) {
                ctx.param._data[i][key] = data.param._data[i][key];
            }
        }
    }
}

CallRequest.prototype.__proto__ = Request.prototype;

module.exports = CallRequest;
