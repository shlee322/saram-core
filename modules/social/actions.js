module.exports = {
    weld: function (ctx, next) {
        var uid = ctx.req.param.uid;
        if(!uid.match(/^[0-9A-Fa-f]+$/)) {
            throw ctx.current.module.error('weld.notuid');
        }
        ctx.param.set(ctx.current.module.getMid(), "uid", uid);
    },
    addFollowing:function(ctx, next) {
        var object = ctx.req.body.object;
        var target = ctx.req.body.target;

        ctx.saram.call.post("/" + object + "/following/", null, {value:target}, function(obj) {
        }, ctx.current.module.getMid());
        ctx.saram.call.post("/" + target + "/follower/", null, {value:object}, function(obj) {
        }, ctx.current.module.getMid());
        ctx.res.send({state:'OK'});
    },
    boxlist:function(ctx, next) {
        var object = ctx.req.param.uid;
        if(!object.match(/^[0-9A-Fa-f]+$/)) {
            throw ctx.current.module.error('notuid');
        }

        ctx.saram.call.get("/" + object + "/follower/", null, function(obj) {
            if(obj.error) {
                throw ctx.current.module.error('error');
            }
            var list = [];
            for(var i in obj.items) {
                list.push(obj.items[i].value);
            }
            list.push(object);
            ctx.res.send({target:list});
        }, ctx.current.module.getMid());
    }
}