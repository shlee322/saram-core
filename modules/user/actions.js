module.exports = {
    uuidWeld: function(ctx, step) {
        var uuid = ctx.req.param.uuid;
        if(uuid == "my") {
            uuid = ctx.auth;
        }
        if(!uuid) {
            ctx.res.send({error:true});
            return null;
        }

        //유저가 다르면 write 제약
        if(uuid!=ctx.auth) {
            ctx.perm.write = false;
        }

        ctx.param.set(ctx.current.module.getMid(), "uuid", uuid);
    },
    signin: function(ctx, step) {
        if(ctx.req.sender.type != "server") {
            ctx.res.error('error');
            return null;
        }

        var uuid = ctx.req.body.uuid;

        ctx.saram.generateUID(function (uid) {
            require('crypto').randomBytes(48, function(ex, buf) {
                var token = uid + buf.toString('hex');

                var key = ctx.current.module.getMid() + "_token_" + token;
                ctx.saram.cache.set(key, uuid, function() {
                    ctx.res.send({access_token:token});
                    step();
                });
            });
        });
        return null;
    },
    auth: function(ctx, step) {
        if(!ctx.req.query.access_token) {
            return;
        }

        var key = ctx.current.module.getMid() + "_token_" + ctx.req.query.access_token;
        ctx.saram.cache.get(key, function(uuid) {
            if(!uuid) {
                ctx.res.send({error:true}); //error
                return;
            }
            ctx.auth = uuid;
            step();
        });

        return null;
    },
    myonly: function(ctx, step) {
        if(ctx.param.get(ctx.current.module.getMid(), "uuid") != ctx.auth) {
            ctx.res.error('write_error');
            return null;
        }
    }
}