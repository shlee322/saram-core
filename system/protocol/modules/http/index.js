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
        request(new HttpContext(saram, req, res));
    });
}

HttpProtocol.prototype.start = function (cb) {
    if(this.path) {
        this._server.listen(this.path, cb);
        return;
    }
    this._server.listen(this.port, this.hostname, this.backlog, cb);
}

module.exports = HttpProtocol;

