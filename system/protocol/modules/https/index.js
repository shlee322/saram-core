var https = require('https');
var HttpContext = require('../http/context.js');
var request = require('../../../routine/request.js');

function HttpsProtocol(ctx, arg) {
    var saram = ctx.getSaram();
    this._server = https.createServer(arg, function(req, res) {
        request(new HttpContext(saram, req, res));
    });
}

HttpsProtocol.prototype.start = function () {
    this._server.listen(443);
}

HttpProtocol.prototype.stop = function (cb) {
    this._server.close(cb);
}

module.exports = HttpsProtocol;
