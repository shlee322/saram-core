var Call = require('../../system/call/index.js');

module.exports = {
    weld: function (ctx) {
    },
    add:function (ctx) {
        ctx.current.autoNext = false;

        var saram = ctx.getSaram();
        var module = ctx.current.module;
        var service = ctx.current.module._service[ctx.req.param.service];

        ctx.errorTry(!service, Error); // service.notfound

        service.add(ctx, function(data){
            Call.post(ctx, "/" + ctx.req.param.service + "/", {weld:module, data:{value:JSON.stringify(data)}}, function(obj) {
                ctx.run(function(){
                    ctx.errorTry(obj.error, obj.error);
                    ctx.res.send(obj);
                    ctx.current.next();
                });
            });
        });
    },
    send:function (ctx) {
        ctx.current.autoNext = false;

        var saram = ctx.getSaram();
        var module = ctx.current.module;
        var service = ctx.current.module._service;

        var sendData = [];

        for(var i in service) {
            Call.get(ctx, "/" + i + "/", {weld:module, query:{}}, function(obj) {
                var items = [];
                for(var item in obj.items) {
                    items.push(JSON.parse(obj.items[item].value));
                }
                service[i].send(ctx, items, function(data){
                    sendData.push(data);
                    if(sendData.length>=module._serviceLength) {
                        ctx.res.send({state:'OK', data:sendData});
                        ctx.current.next();
                    }
                });
            });
        }
    }
}
