var RequestData = require('./data.js');
var RequestBody = require('./requestbody.js');

function Request(ctx) {
    this.sender = { type:"" };
    this.method = "get";
    this.url = {};
    this.param = {};
    this.query = {};
    this.data = new RequestData(ctx);
    this.body = new RequestBody(ctx);
}

module.exports = Request;
