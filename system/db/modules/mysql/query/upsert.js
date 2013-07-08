var DBParam = require('../../../param.js');

function UpsertQuery(ctx, query) {
    this.module = ctx.current.module;
    this.query = query;
    this.table = ctx.current.module._dbTable[query.table];

    this._rawQuery1 = "INSERT INTO `" + query.table + "` VALUE(0x";
    this._rawQuery2 = "";

    for(var i in this.table.columns) {
        if(this.table.columns[i] instanceof DBParam) {
            var param = this.table.columns[i].getColumns();
            for(var p in param)
                this._rawQuery2 += ", ?";
            continue;
        }
        this._rawQuery2 += ", ?";
    }

    this._rawQuery2 += ") ON DUPLICATE KEY UPDATE ";

    for(var i in this.query.update) {
        this._rawQuery2 += "`" + i + "`=?, ";
    }
    this._rawQuery2 = this._rawQuery2.substring(0, this._rawQuery2.length - 2);
}

UpsertQuery.prototype.execute = function (ctx, node, args, callback) {
    var _this = this;

    var rawArgs = [];
    for(var i in this.query.columns) {
        this.addArgs(ctx, rawArgs, this.query.columns[i], args);
    }
    for(var i in this.query.update) {
        this.addArgs(ctx, rawArgs, this.query.columns[this.query.update[i]], args);
    }

    ctx.getSaram().uuid.generate(function (uuid){
        var query = _this._rawQuery1 + uuid + _this._rawQuery2;

        node.rawQuery(ctx, query, rawArgs, function(err, data){
            callback(err, {uuid:uuid});
        });
    });

}

UpsertQuery.prototype.addArgs = function (ctx, rawArgs, column, args) {
    if(column instanceof DBParam) {
        var param = column;
        for (var p in param._param) {
            rawArgs.push(ctx.param.get(param._param[p][0], param._param[p][1]));
        }
    } else if(typeof column == "function") {
        rawArgs.push(column(ctx, args));
    } else {
        rawArgs.push(args[column]);
    }
}


module.exports = UpsertQuery;