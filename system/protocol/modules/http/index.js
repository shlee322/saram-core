var http = require('http');
var Log = require('../../../log/index.js');
var HttpContext = require('./context.js');
var request = require('../../../routine/request.js');

function HttpProtocol(ctx, arg) {
    this.port = arg.port ? arg.port : 80;
    this.hostname = arg.hostname;
    this.backlog = arg.backlog;
    this.path = arg.path;

    Log.notice(ctx, "Load HTTP Protocol - Port : " + this.port);
    var saram = ctx.getSaram();
    this._server = http.createServer(function(req, res) {
        var ctx = new HttpContext(saram, req, res);
        ctx.req.body.readBody(function() {
            request(ctx);
        });
    });
}

HttpProtocol.prototype.start = function (cb) {
    if(this.path) {
        this._server.listen(this.path, cb);
        return;
    }
    this._server.listen(this.port, this.hostname, this.backlog, cb);
}

HttpProtocol.prototype.stop = function (cb) {
    this._server.close(cb);
}

module.exports = HttpProtocol;
