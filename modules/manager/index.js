module.exports = {
    getName:function(){return "elab.manager";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        mod.moduleInfos = {};
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};