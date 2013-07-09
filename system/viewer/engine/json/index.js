var Engine = require('../../engine.js');
var Response = require('./response.js');

function JsonEngine(action) {
    Engine.apply(this);

    this.action = action;
}

JsonEngine.prototype.setResponse = function (ctx, func) {
    var res = ctx.res;
    ctx.res = new Response(ctx.res);
    func(res);
}

JsonEngine.prototype.getAction = function () {
    return this.action;
}

JsonEngine.prototype.__proto__ = Engine.prototype;
module.exports = JsonEngine;