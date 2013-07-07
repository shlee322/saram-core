var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBUtill = require('../../system/db/utill.js');

module.exports = {
    getWeld : function (ctx) {
        var _module = ctx.current.module;

        var table = _module.config.name;
        var dataParam = _module.config.param;

        var hash = _module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        if(_module.list) {
            hash += "key" + ctx.req.param.key;
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        var where = "";
        var data = [];
        for(var i in dataParam) {
            where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
        }
        where += "`key`=?";
        data.push(XXHash.hash(new Buffer(ctx.req.param.key), 0x654C6162));

        var query = "SELECT hex(`uuid`) AS `uuid`, `value` FROM `" + table + "` WHERE " + where;

        var _current = ctx.current;
        _current.autoNext = false;

        DB.rawQuery(ctx, hash, function (db) {
            db.rawQuery(ctx, query, data, function(err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, Error);

                ctx.param.set(ctx.current.module.getMid(), "key", rows[0].uid.toString());
                _current.next();
            });
        });
    },
    get : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'keyvalue.get', { key : XXHash.hash(new Buffer(ctx.req.param.key), 0x654C6162)}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error);

            ctx.res.send({uuid:rows[0].uuid.toString(),  value:rows[0].value});
            _current.next();
        });
    },
    set : function (ctx) {
        var _module = ctx.current.module;

        var table = _module.config.name;
        var dataParam = _module.config.param;

        var hash = _module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        if(_module.list) {
            hash += "key" + ctx.req.param.key;
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        var _current = ctx.current;
        _current.autoNext = false;

        ctx.req.data.readKey("value", function() {
            ctx.getSaram().uuid.generate(function (uuid) {
                DB.rawQuery(ctx, hash, function (db) {
                    var query = "INSERT INTO `" + table + "` VALUES(0x" + uuid;
                    for(var i in dataParam) {
                        query += ", 0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]);
                    }
                    query += ", ?, ?, ?)  ON DUPLICATE KEY UPDATE `str`=?, `value`=?;"
                    var values = [];
                    values.push(XXHash.hash(new Buffer(ctx.req.param.key), 0x654C6162));
                    for(var i=0; i<2; i++) {
                        values.push(ctx.req.param.key);
                        values.push(ctx.req.data.getValue("value"));
                    }

                    db.rawQuery(ctx, query, values, function(err, rows) {
                        ctx.errorTry(err, err);
                        ctx.res.send({state:"OK", uuid:uuid});
                        _current.next();
                    });
                });
            });
        });
    },
    list : function (ctx) {
        var _module = ctx.current.module;
        ctx.errorTry(!_module.config.list, Error);

        var table = _module.config.name;
        var dataParam = _module.config.param;

        var hash = _module.getMid();
        for(var i in dataParam) {
            hash += dataParam[i][0] + dataParam[i][1];
        }
        hash = XXHash.hash(new Buffer(hash), 0x654C6162).toString(16);

        var _current = ctx.current;
        _current.autoNext = false;

        var where = "WHERE ";
        for(var i in dataParam) {
            where += "`" + dataParam[i][0] + "_" + dataParam[i][1] + "`=0x" + ctx.param.get(dataParam[i][0], dataParam[i][1]) + " and ";
        }
        where = where.substring(0, where.length - 5);
        if(where.length == 6) {
            where = "";
        }

        var query = "SELECT hex(`uid`) AS `uid`, `str` as `key`, `value` FROM `" + table + "` " + where;

        DB.rawQuery(ctx, hash, function (db) {
            db.rawQuery(ctx, query, [], function(err, rows) {
                err.errorTry(err, err);
                ctx.res.send({items:rows});
                _current.next();
            });
        });
    }
};