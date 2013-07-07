function SelectQuery(ctx, query) {
    this.module = ctx.current.module;
    this.query = query;
    this.table = ctx.current.module._dbTable[query.table];

    var rawQuery = "SELECT ";
    for(var i in query.columns) {
        if(i=="uuid") {
            rawQuery += "hex(`uuid`) AS `uuid`, ";
            continue;
        }

        rawQuery += "`" + i +"`, ";
    }
    if(rawQuery.length != 7) {
        rawQuery = rawQuery.substring(0, rawQuery.length - 2) + " ";
    } else {
        rawQuery += " * ";
    }

    rawQuery += "FROM `" + query.table + "` ";

    if(query.conditions instanceof Array) {
        rawQuery += "WHERE ";
        for(var i in query.conditions) {
            var condition = query.conditions[i];

            if(condition.oper == "param") {
                var param = this.table.param;
                for (var p in param._param) {
                    rawQuery += "`" + param._param[p][0] + "_" + param._param[p][1] + "`=? and ";
                }
            } else if(condition.oper == "equal") {
                rawQuery += "`" + condition.column + "`=? and ";
            }
        }
        rawQuery = rawQuery.substring(0, rawQuery.length - 4);
    }

    this.rawQuery = rawQuery;
}

SelectQuery.prototype.execute = function (ctx, node, args, callback) {
    var rawArgs = [];

    if(this.query.conditions instanceof Array) {
        for(var i in this.query.conditions) {
            var condition = this.query.conditions[i];

            if(condition.oper == "param") {
                var param = this.table.param;
                for (var p in param._param) {
                    rawArgs.push(ctx.param.get(param._param[p][0], param._param[p][1]));
                }
            } else if(condition.oper == "equal") {
                rawArgs.push(args[condition.var]);
            }
        }
    }

    node.rawQuery(ctx, this.rawQuery, rawArgs, callback);
}

module.exports = SelectQuery;