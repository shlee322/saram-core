var XXHash = require('xxhash');
var nodeHash = require('node_hash/lib/hash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');


module.exports = {
    signup: function(ctx) {
        ctx.current.autoNext = false;

        var table = ctx.current.module.config.name;

        ctx.req.data.readKey(["id", "pw"], function() {
            var id = ctx.req.data.getValue("id");
            var pw = ctx.req.data.getValue("pw");

            var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

            ctx.getSaram().uuid.generate(function (uuid) {
                DB.rawQuery(ctx, hash, function (db) {
                    db.rawQuery(ctx, "INSERT INTO `" + table + "`  VALUES(0x" + uuid + ", ?, ?);", [id, nodeHash.sha256(pw)], function(err, rows) {
                        ctx.errorTry(err, err);
                        ctx.res.send({state:"OK"});
                        ctx.current.next();
                    });
                });
            });
        });
    },
    signin: function(ctx) {
        ctx.current.autoNext = false;

        var table = ctx.current.module.config.name;
        ctx.req.data.readKey(["id", "pw"], function() {
            var id = ctx.req.data.getValue("id");
            var pw = ctx.req.data.getValue("pw");

            var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

            DB.rawQuery(ctx, hash, function (db) {
                db.rawQuery(ctx, "SELECT hex(`uuid`) AS `uuid` FROM `" + table + "` WHERE `id`=? and `pw`=?", [id, nodeHash.sha256(pw)], function(err, rows) {
                    ctx.errorTry(err, err);
                    ctx.errorTry(rows.length < 1, err); //'account.notfound'
                    Call.post(ctx, ctx.current.module.config.userPath + "/signin", {data:{uuid:rows[0].uuid}}, function(obj) {
                        ctx.res.send(obj);
                        ctx.current.next();
                    });
                });
            });
        });
    },
    getUUID: function(ctx) {
        ctx.current.autoNext = false;
        ctx.errorTry(ctx.req.sender.type != "server", Error); // 'perm.notserver'
        var table = ctx.current.module.config.name;
        var id = ctx.req.query.id;

        ctx.errorTry(!id, Error); // id.netfound

        var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            db.rawQuery(ctx, "SELECT hex(`uuid`) AS `uuid` FROM `" + table + "` WHERE `id`=?", [id], function(err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, err); //'account.notfound'
                ctx.res.send({uuid:rows[0].uuid});
                ctx.current.next();
            });
        });
    }
}