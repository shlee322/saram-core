var fs = require('fs');
var ejs = require('ejs');
var Template = require('../../template.js');
var Response = require('./response.js');

function EjsEngine(action, file) {
    Template.apply(this);

    this.action = action;
    this.file = file;
    this._viewer = {};
}

EjsEngine.prototype.setResponse = function (ctx, func) {
    var viewer = this._viewer[ctx.current.module.getSkin()];

    if(!viewer) {
        var data = fs.readFileSync(ctx.current.module.getSkin() + "/" + this.file);
        viewer = ejs.compile(data);
        this._viewer[ctx.current.module.getSkin()] = viewer;
    }

    var res = ctx.res;
    ctx.res = new Response(ctx.res, viewer);
    func(res);
}

EjsEngine.prototype.getAction = function () {
    return this.action;
}

EjsEngine.prototype.__proto__ = Template.prototype;
module.exports = EjsEngine;
