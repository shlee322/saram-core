var RequestData = require('./data.js');

function Request() {
    this.sender = { type:"" };
    this.method = "get";
    this.url = {};
    this.param = {};
    this.query = {};
    this.data = new RequestData();
}

module.exports = Request;
