var request = require('request');
var querystring = require("querystring");
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');

module.exports = {
    auth: function(ctx) {
        ctx.current.autoNext = false

        var key = ctx.req.body.getValue("key");

        DB.execute(ctx, 'simauth.getAccount', { key:key }, function (err, rows) {
            ctx.errorTry(err, err);

            if(rows.length < 1)  {
                DB.execute(ctx, 'simauth.register', { key:key }, function (err, rows) {
                    Call.post(ctx, "/signin", {weld:ctx.current.module.config.userModule, data:{uuid:rows.uuid}}, function(obj) {
                        ctx.res.send(obj);
                        ctx.current.next();
                    });
                });
                return;
            }

            Call.post(ctx, "/signin", {weld:ctx.current.module.config.userModule, data:{uuid:rows[0].uuid}}, function(obj) {
                ctx.res.send(obj);
                ctx.current.next();
            });
        });
    }
};
