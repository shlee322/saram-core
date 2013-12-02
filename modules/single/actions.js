var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');

module.exports = {
    get : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'single.get', {}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            ctx.res.send(rows[0]);
            _current.next();
        });
    },
    set : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;
        var data = { };
        for(var name in ctx.current.module.config.columns) {
            data[name] = ctx.req.body.getValue(name);
        }

        DB.execute(ctx, 'single.set', data, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({state:"OK", uuid:ctx.req.param.uuid});
            _current.next();
        });
    },
    delete : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'single.delete', {}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({state:"OK"});
            _current.next();
        });
    },
    getWeld : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'single.get', { }, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            ctx.param.set(ctx.current.module.getMid(), "uuid", rows[0].uuid.toString());
            _current.next();
        });
    }
};
