var crypto = require('crypto');
var Cache = require('../../system/cache/index');

var UUID_REG = /^[0-9A-Fa-f]+$/;

module.exports = {
    uuidWeld: function(ctx) {
        var uuid = ctx.req.param.uuid;
        if(uuid == "my")
            uuid = ctx[ctx.current.module.config.var];

        if(!uuid.match(UUID_REG))
            uuid = null;

        ctx.errorTry(!uuid, Error);

        ctx.param.set(ctx.current.module.getMid(), "uuid", uuid);
    },
    signin: function(ctx) {
        ctx.errorTry(ctx.req.sender.type != "server", Error);

        var tokenVar = ctx.current.module.config.token;

        ctx.current.authNext = false;
        ctx.req.data.readKey(["uuid"], function() {
            var uuid = ctx.req.data.getValue("uuid");
            ctx.getSaram().uuid.generate(function (token) {
                crypto.randomBytes(48, function(ex, buf) {
                    token = token + buf.toString('hex');

                    var key = ctx.current.module.getMid() + "_token_" + token;
                    Cache.set(ctx, key, uuid, function() {
                        var obj = {};
                        obj[tokenVar] = token;
                        ctx.res.send(obj);
                        ctx.current.next();
                    });
                });
            });
        });
    },
    my_uuid : function(ctx) {
        var authVar = ctx.current.module.config.var;
        ctx.errorTry(!ctx[authVar], Error); // 'uuid.notfound'
        ctx.res.send({uuid:ctx[authVar]});
    },
    auth: function(ctx) {
        var authVar = ctx.current.module.config.var;
        var token = ctx.req.query[ctx.current.module.config.token];
        if(!token)
            return;

        ctx.current.authNext = false;

        var key = ctx.current.module.getMid() + "_token_" + token;
        Cache.get(ctx, key, function(uuid) {
            ctx.errorTry(!uuid, Error); // auth.token.expired

            ctx[authVar] = uuid;
            ctx.current.next();
        });
    },
    myonly: function(ctx) {
        var authVar = ctx.current.module.config.var;
        ctx.errorTry(ctx.param.get(ctx.current.module.getMid(), "uuid") != ctx[authVar] && ctx.req.sender.type != "server", Error); // perm.myonly
    },
    useAuth: function(ctx) {
        var authVar = ctx.current.module.config.var;
        ctx.errorTry(!ctx[authVar], Error); // 'perm.notUseAuth'
    }
}
