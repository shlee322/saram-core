module.exports = {
    add:function (ctx, next) {
        var service = ctx.current.module.service[ctx.req.param.service];
        if(!service) {
            throw ctx.current.module.error('service.notfound');
        }

        service.add(ctx, function(data){
            ctx.saram.call.post("/" + ctx.req.param.service + "/", null, {value:JSON.stringify(data)}, function(obj) {
                ctx.run(function(){
                    ctx.current.module.errorTry(obj.error, obj.error);
                    ctx.res.send(obj);
                    next();
                });
            }, ctx.current.module.getMid(), { param : ctx.param });
        });
        return null;
    },
    send:function (ctx, next) {
        var service = ctx.current.module.service;
        for(var i in service) {
            ctx.saram.call.get("/" + i + "/", null, function(obj) {
                var items = [];
                for(var item in obj.items) {
                    items.push(JSON.parse(obj.items[item].value));
                }
                service[i].send(ctx, items, function(){});
            }, ctx.current.module.getMid(), { param : ctx.param });
        }
        ctx.res.send({state:'OK'});
        next();
    }
}