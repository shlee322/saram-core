var url = require('url');
var querystring = require('querystring');
var Request = require('../context/request.js');
var CallData = require('./data.js');

function CallRequest(ctx, method, path, data) {
    Request.apply(this);

    this.sender = { type:"server", name:"local", direct:false };
    this.method = method;
    this.path = path;
    this.query = data.query ? data.query : {};
    this.data = new CallData(data.data);

    for(var i in data.param._data) {
        ctx.param._data[i] = {};
        for(var key in data.param._data[i]) {
            ctx.param._data[i][key] = data.param._data[i][key];
        }
    }
}

CallRequest.prototype.__proto__ = Request.prototype;

module.exports = CallRequest;