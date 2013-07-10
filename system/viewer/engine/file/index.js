var Engine = require('../../engine.js');
var Response = require('./response.js');

function FileEngine(action) {
    Engine.apply(this);

    this.action = action;
}

FileEngine.prototype.setResponse = function (ctx, func) {
    var res = ctx.res;
    ctx.res = new Response(ctx.res);
    func(res);
}

FileEngine.prototype.getAction = function () {
    return this.action;
}

FileEngine.prototype.__proto__ = Engine.prototype;
module.exports = FileEngine;
