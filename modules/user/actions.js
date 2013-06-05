module.exports = {
    uuidWeld: function(ctx, step) {
        var uuid = ctx.req.param.uuid;
        if(uuid == "my") {
            uuid = ctx.auth;
        }
        if(!uuid.match(/^[0-9A-Fa-f]+$/)) {
            uuid = null;
        }
        if(!uuid) {
            throw ctx.current.module.error('weld.notuuid');
        }

        ctx.param.set(ctx.current.module.getMid(), "uuid", uuid);
    },
    signin: function(ctx, step) {
        if(ctx.req.sender.type != "server") {
            throw ctx.current.module.error('perm.notserver');
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
                throw ctx.current.module.error('auth.token.expired');
            }
            ctx.auth = uuid;
            step();
        });

        return null;
    },
    myonly: function(ctx, step) {
        if(ctx.param.get(ctx.current.module.getMid(), "uuid") != ctx.auth && ctx.req.sender.type != "server") {
            throw ctx.current.module.error('perm.myonly');
        }
    },
    useAuth: function(ctx, step) {
        if(!ctx.req.auth) {
            throw ctx.current.module.error('perm.notUseAuth');
        }
    }
}