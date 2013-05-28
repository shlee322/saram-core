module.exports = {
    getName:function(){return "elab.user";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};