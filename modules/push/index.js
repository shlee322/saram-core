module.exports = {
    getName:function(){return "elab.push";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        var service = obj.service;
        mod.service = {};
        for(var i in service) {
            var moduleName = ctx.current.module.getMid()+'.'+i;
            ctx.saram.use('elab.list', ctx.current.module.getMid()+'.'+i, {
                name:ctx.current.module.getMid()+"_"+i,
                param : obj.param,
                overlap:false
            });
            ctx.saram.weld(ctx.current.module.getMid(), moduleName, i);
            ctx.saram.addReceiver(moduleName, 'call.get.before', null, 'serverOnly');
            ctx.saram.addReceiver(moduleName, 'call.insert.before', null, 'serverOnly');
            ctx.saram.addReceiver(moduleName, 'call.update.before', null, 'serverOnly');
            ctx.saram.addReceiver(moduleName, 'call.delete.before', null, 'serverOnly');

            var ser = require('./service/'+service[i].type+".js");
            mod.service[i] = new ser(ctx, i, service[i]);
        }
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};