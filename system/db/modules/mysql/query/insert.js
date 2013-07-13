var DBParam = require('../../../param.js');

function InsertQuery(ctx, query) {
    this.module = ctx.current.module;
    this.query = query;
    this.table = ctx.current.module._dbTable[query.table];

    this._rawQuery1 = "INSERT INTO `" + query.table + "` VALUE(0x";
    this._rawQuery2 = "";

    for(var i in this.query.columns) {
        if(this.query.columns[i] instanceof DBParam) {
            var param = this.query.columns[i].getColumns();
            for(var p in param)
                this._rawQuery2 += ", x?";
            continue;
        }
        this._rawQuery2 += ", ?";
    }
    this._rawQuery2 += ")";
}

InsertQuery.prototype.execute = function (ctx, node, args, callback) {
    var _this = this;


    var rawArgs = [];
    for(var i in this.query.columns) {
        if(this.query.columns[i] instanceof DBParam) {
            var param = this.query.columns[i];
            for (var p in param._param) {
                rawArgs.push(ctx.param.get(param._param[p][0], param._param[p][1]));
            }
        } else if(typeof this.query.columns[i] == "function") {
            rawArgs.push(this.query.columns[i](ctx, args));
        } else {
            rawArgs.push(args[this.query.columns[i]]/*args[]*/);
        }
    }

    ctx.getSaram().uuid.generate(function (uuid){
        var query = _this._rawQuery1 + uuid + _this._rawQuery2;

        node.rawQuery(ctx, query, rawArgs, function(err, data){
            callback(err, {uuid:uuid});
        });
    });

}

module.exports = InsertQuery;
