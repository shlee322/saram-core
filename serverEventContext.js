var url = require('url');
var context = require('./context.js');

module.exports = function(saram, moduleContent, moduleObject, event) {
    var req = {};
    req.sender = {type:"server_event"};
    req.url = url.parse("saram://" + moduleObject.getMid() + "/" + event, true);
    req.query = req.url.query;
    req.path = req.url.pathname;
    req.type = "data";
    req.body = "";

    var ctx = new context(saram, req, []);
    ctx.setResponse(response());

    ctx.current = {module:moduleObject ? moduleObject.obj : null, moduleContent:moduleContent, moduleObject:moduleObject, event:event};

    return ctx;
}

function response() {
    var response = {};
    response.raw = {};
    response.raw.type = "server_event";
    response.raw.obj = null;

    response.info = function (obj) {
    };

    response.send = response.info;

    response.error = function (error, code) {
        throw error;
    };

    return response;
}