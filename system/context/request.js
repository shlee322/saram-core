var RequestData = require('./data.js');

function Request(ctx) {
    this.sender = { type:"" };
    this.method = "get";
    this.url = {};
    this.param = {};
    this.query = {};
    this.data = new RequestData(ctx);
}

module.exports = Request;
