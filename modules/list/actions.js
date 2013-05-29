var XXHash = require('xxhash');

module.exports = {
    list : function (ctx, step) {
        var table = ctx.current.module.name;
        var dataParam = ctx.current.module.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        ctx.db.query(hash, function (db) {
            var where = "WHERE ";
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
                ctx.res.send(rows);
                step();
            });
        });
        return null;
    },
    add : function (ctx, step) {
        var table = ctx.current.module.name;
        var dataParam = ctx.current.module.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        ctx.saram.generateUID(function (uid) {
            ctx.db.query(hash, function (db) {
                var query = "INSERT INTO `" + table + "` VALUES(0x" + uid;
                for(var i in dataParam) {
                    query += ", 0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]);
                }
                query += ", ?, ?)  ON DUPLICATE KEY UPDATE `value`=?;"
                var values = [];
                values.push(XXHash.hash(new Buffer(ctx.req.body.value), 0x654C6162));
                for(var i=0; i<2; i++) {
                    values.push(ctx.req.body.value);
                }

                db.query(query, values, function(err, rows) {
                    if(err) {
                        throw ctx.current.module.error('error.insert');
                    } else {
                        ctx.res.send({state:"OK", uid:uid});
                    }

                    step();
                });
            });
        });

        return null;
    },
    get : function (ctx, step) {
        var table = ctx.current.module.name;
        var dataParam = ctx.current.module.param;

        var hash = ctx.current.module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        ctx.db.query(hash, function (db) {
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
                ctx.res.send(rows[0]);
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

        ctx.db.query(hash, function (db) {
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