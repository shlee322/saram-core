module.exports = {
    getName:function(){return "elab.test";},
    load:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        console.log("test load");
    },
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        console.log("test init");
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};