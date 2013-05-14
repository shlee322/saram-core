var XXHash = require('xxhash');
var nodeHash = require('node_hash/lib/hash');

module.exports = {
    signup: function(ctx, step) {
        var table = ctx.current.module.name;
        var id = ctx.req.body.id;
        var pw = ctx.req.body.pw;

        var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

        ctx.saram.generateUID(function (uid) {
            ctx.saram.db.query(hash, function (db) {
                db.query("INSERT INTO `" + table + "`  VALUES(0x" + uid + ", ?, ?);", [id, nodeHash.sha256(pw)], function(err, rows) {
                    if(err) {
                        throw err;
                        ctx.res.send({state:"ERROR"});
                    } else {
                        ctx.res.send({state:"OK"});
                    }

                    step();
                });
            });
        });

        return null;
    },
    signin: function(ctx, step) {
        var table = ctx.current.module.name;
        var id = ctx.req.body.id;
        var pw = ctx.req.body.pw;

        var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

        ctx.saram.db.query(hash, function (db) {
            db.query("SELECT hex(`uid`) AS `uid` FROM `" + table + "` WHERE `id`=? and `pw`=?", [id, nodeHash.sha256(pw)], function(err, rows) {
                if(err) {
                    throw err;
                }
                if(rows.length < 1)  {
                    ctx.res.send({error:true});
                } else {
                    ctx.saram.call.post(ctx.current.module.userPath + "/signin", null, {uuid:rows[0].uid}, function(obj) {
                        ctx.res.send(obj);
                    });
                }

                step();
            });
        });
        return null;
    }
}