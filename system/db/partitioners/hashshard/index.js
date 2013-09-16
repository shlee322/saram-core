var XXHash = require('xxhash');
var DBParam = require('../../param.js');

function HashShard(func) {
    if(typeof func == "function") {
        this._func = func;
        return;
    }

    if(!(func instanceof Array)) {
        this._func = function (ctx, length, args) {
            return [0];
        }
        return;
    }

    var itemsFunc = [];
    var items = func;
    for(var i in items) {
        var item = items[i];
        if(item instanceof DBParam) {
            for (var p in item._param) {
                var param = item;
                var mod = p;
                itemsFunc.push(function (ctx, args) {
                    return XXHash.hash(new Buffer(ctx.param.get(param._param[mod][0], param._param[mod][1])), 0x654C6162);
                });
            }
        } else if(typeof item == "function") {
            itemsFunc.push(item);
        } else if(typeof item == "string") {
            var name = item;
            itemsFunc.push(function (ctx, args) {
                return XXHash.hash(new Buffer(args[name]), 0x654C6162);
            });
        }
    }

    this._func = function (ctx, length, args) {
        var buf = new Buffer(4*itemsFunc.length);
        for(var i in itemsFunc) {
            buf.writeUInt32LE(itemsFunc[i](ctx, args), 4*i);
        }
        var hash = XXHash.hash(buf, 0x654C6162);
        return [hash%length];
    }
}

HashShard.prototype.execute = function (ctx, query, cluster, args, callback) {
    var nodes = this._func(ctx, cluster.length, args);

    var count = 0;
    var length = nodes.length;
    var allErr = null;
    var allRows = [];

    for(var i in nodes) {
        var node = nodes[i];
        query.protocol[cluster[node].getProtocol()].execute(ctx, cluster[node], args, function (err, rows) {
            count = count + 1;
            //TODO : 에러 처리 수정
            if(err) {
                allErr = err;
            }
            for(var i in rows) {
                allRows.push(rows[i]);
            }
            if(count >= length) {
                callback(err, allRows);
            }
        });
    }
}


module.exports = HashShard;