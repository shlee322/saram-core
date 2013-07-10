var EventContext = require("../eventcontext/index.js");

function Protocol(saram) {
    this._saram = saram;
    this._protocol = [];
}

Protocol.prototype.addProtocol = function (protocol, arg) {
    var _this = this;
    var ctx = new EventContext(this._saram, "saram.core.protocol.addProtocol");

    ctx.run(function () {
        if(typeof protocol == "string")
            protocol = require('./modules/' + protocol);

        _this._protocol.push(new protocol(ctx, arg));
    });
}

Protocol.prototype.start = function (ctx) {
    for(var i in this._protocol)
        this._protocol[i].start();
}

module.exports = Protocol;
