var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');

module.exports = {
    list : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'list.getList', {}, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({items:rows});
            _current.next();
        });
    },
    insert : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        ctx.req.data.readKey("value", function() {
            var data = { value:ctx.req.data.getValue("value") };

            DB.execute(ctx, 'list.insert', data, function (err, rows) {
                ctx.errorTry(err, err);
                ctx.res.send({state:"OK", uuid:rows.uuid});
                _current.next();
            });
        });
    },
    get : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'list.get', { uuid : ctx.req.param.uuid }, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            ctx.res.send(rows[0]);
            _current.next();
        });
    },
    update : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        ctx.req.data.readKey("value", function() {
            var data = { uuid:ctx.req.param.uuid, value:ctx.req.data.getValue("value") };

            DB.execute(ctx, 'list.update', data, function (err, rows) {
                ctx.errorTry(err, err);
                ctx.res.send({state:"OK", uuid:ctx.req.param.uuid});
                _current.next();
            });
        });
    },
    delete : function (ctx, step) {
        var _current = ctx.current;
        _current.autoNext = false;

        var data = { uuid:ctx.req.param.uuid };

        DB.execute(ctx, 'list.delete', data, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.res.send({state:"OK"});
            _current.next();
        });
    },
    getWeld : function (ctx) {
        var _current = ctx.current;
        _current.autoNext = false;

        DB.execute(ctx, 'list.get', { uuid : ctx.req.param.uuid }, function (err, rows) {
            ctx.errorTry(err, err);
            ctx.errorTry(rows.length < 1, Error.NotFound);
            ctx.param.set(ctx.current.module.getMid(), "uuid", rows[0].uuid.toString());
            _current.next();
        });
    }
};