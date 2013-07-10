var domain = require('domain');
var Param = require('./param.js');
var Request = require('./request.js');
var Response = require('./response.js');

function Context(saram) {
    var _this = this;

    this._saram = saram;

    this._domain = domain.create();
    this._domain.on('error', function(er){
        _this.res.error(er);
    });
    this.param = new Param();
    this.current = {};

    this.req = new Request();
    this.res = new Response();
}

Context.prototype.getSaram = function () {
    return this._saram;
}

Context.prototype.run = function (func) {
    this._domain.run(func);
}

Context.prototype.catch = function () {
    var object = new Object();
    object.__proto__ = this;
    object.useCatch = true;
    return object;
}

Context.prototype.errorTry = function (condition, error) {
    if(!condition)
        return;
    if(error instanceof Error)
        throw error;

    throw new error(this);
}

Context.prototype.setChild = function (childCtx) {
    childCtx._parent = this;
    return childCtx;
}

module.exports = Context;
