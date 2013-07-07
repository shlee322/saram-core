function InsertQuery(ctx, query) {
    this.module = ctx.current.module;
    this.query = query;
    this.table = ctx.current.module._dbTable[query.table];

    this._rawQuery1 = "INSERT INTO `" + query.table + "` VALUE(0x";
    this._rawQuery2 = "";
    for(var i in this.table.columns) {
        this._rawQuery2 += ", ?";
    }
    this._rawQuery2 += ")";
}

InsertQuery.prototype.execute = function (ctx, node, args, callback) {
}

module.exports = InsertQuery;