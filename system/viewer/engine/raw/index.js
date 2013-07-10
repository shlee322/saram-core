var Engine = require('../../engine.js');
var Response = require('./response.js');

function RawEngine(action) {
    Engine.apply(this);

    this.action = action;
}

RawEngine.prototype.setResponse = function (ctx, func) {
    var res = ctx.res;
    ctx.res = new Response(ctx.res);
    func(res);
}

RawEngine.prototype.getAction = function () {
    return this.action;
}

RawEngine.prototype.__proto__ = Engine.prototype;
module.exports = RawEngine;
