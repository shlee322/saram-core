var EventContext = require("../eventcontext/index.js");

function Protocol(saram) {
    this._saram = saram;
    this._protocol = [];
}

Protocol.prototype.addProtocol = function (protocol, arg) {
    var _this = this;
    var ctx = new EventContext(this._saram, "saram.core.protocol.addProtocol");
    if(typeof(arg) != "object")
        arg = {};

    ctx.run(function () {
        if(typeof protocol == "string")
            protocol = require('./modules/' + protocol);

        _this._protocol.push(new protocol(ctx, arg));
    });
}

Protocol.prototype.start = function (ctx, cb) {
    var queue = this._protocol.slice();

    var callback = function () {
        if(queue.length < 1) {
            cb();
            return;
        }
        var protocol = queue.shift();
        protocol.start(callback);
    }
    callback();
}

module.exports = Protocol;
