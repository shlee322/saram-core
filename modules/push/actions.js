var Call = require('../../system/call/index.js');

module.exports = {
    add:function (ctx) {
        ctx.current.authNext = false;
        var saram = ctx.getSaram();
        ctx.req.data.readKey(["device"], function() {
            var service = ctx.current.module._service[ctx.req.param.service];

            ctx.errorTry(!service, Error); // service.notfound

            service.add(ctx, function(data){
                Call.post(ctx, "/" + ctx.req.param.service + "/", {data:{value:JSON.stringify(data)}}, function(obj) {
                    ctx.run(function(){
                        ctx.errorTry(obj.error, obj.error);
                        ctx.res.send(obj);
                        ctx.current.next();
                    });
                }, ctx.current.module.getMid(), { param : ctx.param });
            });
        });
    },
    send:function (ctx) {
        var saram = ctx.getSaram();
        var service = ctx.current.module._service;

        for(var i in service) {
            Call.get(ctx, "/" + i + "/", null, function(obj) {
                var items = [];
                for(var item in obj.items) {
                    items.push(JSON.parse(obj.items[item].value));
                }
                service[i].send(ctx, items, function(){});
            }, ctx.current.module.getMid(), { param : ctx.param });
        }
        ctx.res.send({state:'OK'});
    }
}
