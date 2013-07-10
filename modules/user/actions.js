var crypto = require('crypto');
var Cache = require('../../system/cache/index');

var UUID_REG = /^[0-9A-Fa-f]+$/;

module.exports = {
    uuidWeld: function(ctx) {
        var uuid = ctx.req.param.uuid;
        if(uuid == "my")
            uuid = ctx.auth;

        if(!uuid.match(UUID_REG))
            uuid = null;

        ctx.errorTry(!uuid, Error);

        ctx.param.set(ctx.current.module.getMid(), "uuid", uuid);
    },
    signin: function(ctx) {
        ctx.errorTry(ctx.req.sender.type != "server", Error);
        ctx.current.authNext = false;
        ctx.req.data.readKey(["uuid"], function() {
            var uuid = ctx.req.data.getValue("uuid");

            ctx.getSaram().uuid.generate(function (uuid) {
                crypto.randomBytes(48, function(ex, buf) {
                    var token = uuid + buf.toString('hex');

                    var key = ctx.current.module.getMid() + "_token_" + token;
                    Cache.set(ctx, key, uuid, function() {
                        ctx.res.send({access_token:token});
                        ctx.current.next();
                    });
                });
            });
        });
    },
    my_uuid : function(ctx) {
        ctx.errorTry(!ctx.auth, Error); // 'uuid.notfound'
        ctx.res.send({uuid:ctx.auth});
    },
    auth: function(ctx) {
        if(!ctx.req.query.access_token)
            return;

        ctx.current.authNext = false;

        var key = ctx.current.module.getMid() + "_token_" + ctx.req.query.access_token;
        Cache.get(ctx, key, function(uuid) {
            ctx.errorTry(!uuid, Error); // auth.token.expired

            ctx.auth = uuid;
            ctx.current.next();
        });
    },
    myonly: function(ctx) {
        ctx.errorTry(ctx.param.get(ctx.current.module.getMid(), "uuid") != ctx.auth && ctx.req.sender.type != "server", Error); // perm.myonly
    },
    useAuth: function(ctx) {
        ctx.errorTry(!ctx.req.auth, Error); // 'perm.notUseAuth'
    }
}
