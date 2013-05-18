module.exports = {
    add:function (ctx, next) {
        var service = ctx.current.module.service[ctx.req.param.service];
        if(!service) {
            throw ctx.current.module.error('service.notfound');
        }

        service.add(ctx, next);
    },
    send:function (ctx, next) {
        var service = ctx.current.module.service;
        for(var i in service) {
            service[i].send(ctx);
        }
        next();
    }
}