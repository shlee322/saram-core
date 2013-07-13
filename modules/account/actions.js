var XXHash = require('xxhash');
var nodeHash = require('node_hash/lib/hash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');


module.exports = {
    signup: function(ctx) {
        var _current = ctx.current;
        ctx.current.autoNext = false;

        ctx.req.data.readKey(["id", "pw"], function() {
            var id = ctx.req.data.getValue("id");
            var pw = ctx.req.data.getValue("pw");

            DB.execute(ctx, 'account.signup', { id:id, pw:pw }, function (err, rows) {
                ctx.errorTry(err, err);
                ctx.res.send({state:"OK"});
                _current.next();
            });
        });
    },

    signin: function(ctx) {
        var _current = ctx.current;
        ctx.current.autoNext = false;

        ctx.req.data.readKey(["id", "pw"], function() {
            var id = ctx.req.data.getValue("id");
            var pw = ctx.req.data.getValue("pw");

            DB.execute(ctx, 'account.getAccount', { id:id }, function (err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, Error); //'account.notfound'
                ctx.errorTry(nodeHash.sha256(pw) != rows[0].pw, Error);
                Call.post(ctx, "/signin", { weld:ctx.current.module.config.userModule, data:{uuid:rows[0].uuid} }, function(obj) {
                    ctx.res.send(obj);
                    _current.next();
                });
            });
        });
    },
    getUUID: function(ctx) {
        ctx.current.autoNext = false;

        ctx.errorTry(ctx.req.sender.type != "server", Error); // 'perm.notserver'

        ctx.req.data.readKey(["id"], function() {
            var id = ctx.req.data.getValue("id");

            DB.execute(ctx, 'account.getAccount', { id:id }, function (err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, Error); //'account.notfound'
                ctx.res.send({uuid:rows[0].uuid});
                ctx.current.next();
            });
        });
    }
}
