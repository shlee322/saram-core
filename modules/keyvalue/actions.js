var DB = require('../../system/db/index.js');
var Error = require('./error.js');

module.exports = {
    getWeld : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'keyvalue.get', { key : ctx.req.param.key}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            ctx.param.set(ctx.current.module.getMid(), "uuid", rows[0].uuid.toString());
            _current.next();
        });
    },
    get : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'keyvalue.get', { key : ctx.req.param.key }, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            var data = { uuid:rows[0].uuid.toString() };
            for(var name in _current.module.config.columns) {
                data[name] = rows[0][name];
            }

            ctx.res.send(data);
            _current.next();
        });
    },
    set : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        var data = { key : ctx.req.param.key };
        for(var name in ctx.current.module.config.columns) {
            data[name] = ctx.req.body.getValue(name);
        }

        DB.execute(ctx, 'keyvalue.set', data, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({state:"OK", uuid:rows.uuid});
            _current.next();
        });
    },
    list : function (ctx) {
        ctx.errorTry(!ctx.current.module.config.list, Error.DisabledList);

        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'keyvalue.list', {}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({items:rows});
            _current.next();
        });
    }
};
