var Call = require('../../system/call/index.js');

var UUID_Reg = /^[0-9A-Fa-f]+$/;

module.exports = {
    weld: function (ctx) {
        var uuid = ctx.req.param.uuid;
        ctx.errorTry(!uuid.match(UUID_Reg), Error); // 'weld.notuid'
        ctx.param.set(ctx.current.module.getMid(), "uuid", uuid);
    },
    addFollowing:function(ctx) {
        ctx.req.data.readKey(["object", "target"], function() {
            var object = ctx.req.data.getValue("object");
            var target = ctx.req.data.getValue("target");

            Call.post(ctx, "/" + object + "/following/", null, {value:target}, function(obj) {
            }, ctx.current.module.getMid());
            Call.post(ctx, "/" + target + "/follower/", null, {value:object}, function(obj) {
            }, ctx.current.module.getMid());
            ctx.res.send({state:'OK'});
        });
    },
    boxlist:function(ctx) {
        var saram = ctx.getSaram();
        var object = ctx.req.param.uuid;
        ctx.errorTry(!object.match(UUID_Reg), Error); // 'notuuid'

        Call.get(ctx, "/" + object + "/follower/", null, function(obj) {
            ctx.errorTry(obj.error, Error);

            var list = [];
            for(var i in obj.items) {
                list.push(obj.items[i].value);
            }
            list.push(object);
            ctx.res.send({target:list});
        }, ctx.current.module.getMid());
    }
}
