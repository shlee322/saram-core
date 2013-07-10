var http = require('http');
var HttpContext = require('./context.js');
var request = require('../../../routine/request.js');

function HttpProtocol(ctx, arg) {
    var saram = ctx.getSaram();
    this._server = http.createServer(function(req, res) {
        request(new HttpContext(saram, req, res));
    });
}

HttpProtocol.prototype.start = function () {
    this._server.listen(80);
}

module.exports = HttpProtocol;

