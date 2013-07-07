var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');

module.exports = {
    list : function (ctx) {
        var config = ctx.current.module.config;

        var table = config.name;
        var dataParam = config.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        var where = "WHERE ";
        for(var i in dataParam) {
            where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
        }
        where = where.substring(0, where.length - 5);
        if(where.length == 6) {
            where = "";
        }

        DB.rawQuery(ctx, hash, function (db) {
            db.rawQuery(ctx, "SELECT hex(`uuid`) AS `uuid`, `value` FROM `" + table + "` " + where, [], function(err, rows) {
                ctx.errorTry(err, err);

                ctx.res.send({items:rows});
                ctx.current.next();
            });
        });

        ctx.current.authNext = false;
    },
    insert : function (ctx, step) {
        var config = ctx.current.module.config;

        var table = config.name;
        var dataParam = config.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        ctx.req.data.readKey(["value"], function() {
            ctx.getSaram().uuid.generate(function (uuid) {
                DB.rawQuery(ctx, hash, function (db) {
                    var query = "INSERT INTO `" + table + "` VALUES(0x" + uuid;
                    for(var i in dataParam) {
                        query += ", 0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]);
                    }
                    query += ", ?, ?)  ON DUPLICATE KEY UPDATE `value`=?;"
                    var values = [];
                    values.push(XXHash.hash(new Buffer(ctx.req.data.getValue("value")), 0x654C6162));
                    for(var i=0; i<2; i++) {
                        values.push(ctx.req.data.getValue("value"));
                    }

                    db.rawQuery(ctx, query, values, function(err, rows) {
                        ctx.errorTry(err, Error); // error.insert
                        ctx.res.send({state:"OK", uuid:uuid});
                        ctx.current.next();
                    });
                });
            });
        });

        ctx.current.authNext = false;
    },
    get : function (ctx, step) {
        var table = ctx.current.module.config.name;
        var dataParam = ctx.current.module.config.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            var where = "WHERE `uuid`=0x" + ctx.req.param.uuid + " and ";
            for(var i in dataParam) {
                where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
            }
            where = where.substring(0, where.length - 5);
            if(where.length == 6) {
                where = "";
            }

            db.rawQuery(ctx, "SELECT hex(`uuid`) AS `uuid`, `value` FROM `" + table + "` " + where, [], function(err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, Error); // uuid.notfound
                ctx.res.send(rows[0]);
                ctx.current.next();
            });
        });

        ctx.current.authNext = false;
    },
    update : function (ctx, step) {
        var table = ctx.current.module.config.name;
        var dataParam = ctx.current.module.config.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            var where = "WHERE `uid`=0x" + ctx.req.param.uid + " and ";
            for(var i in dataParam) {
                where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
            }
            where = where.substring(0, where.length - 5);
            if(where.length == 6) {
                where = "";
            }

            db.rawQuery(ctx, "UPDATE `" + table + "` SET `value`=? " + where, [ctx.req.body.value], function(err, rows) {
                if(err) {
                    throw err;
                }
                ctx.res.send({state:'OK'});
                step();
            });
        });
        return null;
    },
    delete : function (ctx, step) {
        var table = ctx.current.module.name;
        var dataParam = ctx.current.module.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            var where = "WHERE `uid`=0x" + ctx.req.param.uid + " and ";
            for(var i in dataParam) {
                where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
            }
            where = where.substring(0, where.length - 5);
            if(where.length == 6) {
                where = "";
            }

            db.rawQuery(ctx, "DELETE FROM `" + table + "` " + where, [], function(err, rows) {
                if(err) {
                    throw err;
                }
                ctx.res.send({state:'OK'});
                step();
            });
        });
        return null;
    },
    getWeld : function (ctx, step) {
        var table = ctx.current.module.name;
        var dataParam = ctx.current.module.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            var where = "WHERE `uid`=0x" + ctx.req.param.uid + " and ";
            for(var i in dataParam) {
                where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
            }
            where = where.substring(0, where.length - 5);
            if(where.length == 6) {
                where = "";
            }

            db.query("SELECT hex(`uid`) AS `uid`, `value` FROM `" + table + "` " + where, [], function(err, rows) {
                if(err) {
                    throw err;
                }
                if(rows.length < 1) {
                    throw ctx.current.module.error('uid.notfound');
                }
                ctx.param.set(ctx.current.module.getMid(), "uid", rows[0].uid.toString());
                step();
            });
        });
        return null;
    }
};