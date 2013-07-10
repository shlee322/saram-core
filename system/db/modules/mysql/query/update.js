var DBParam = require('../../../param.js');

function UpdateQuery(ctx, query) {
    this.module = ctx.current.module;
    this.query = query;
    this.table = ctx.current.module._dbTable[query.table];

    var rawQuery = "UPDATE `" + query.table + "` SET ";
    for(var i in query.columns) {
        /*if(i=="uuid") {
            rawQuery += "hex(`uuid`) AS `uuid`, ";
            continue;
        }*/

        rawQuery += "`" + i +"`=?, ";
    }

    rawQuery = rawQuery.substring(0, rawQuery.length - 2) + " ";

    if(query.conditions instanceof Array) {
        rawQuery += "WHERE ";
        for(var i in query.conditions) {
            var condition = query.conditions[i];

            if(condition.oper == "param") {
                var paramColumns = condition.param.getColumns();
                for(var p in paramColumns)
                    rawQuery += "`" + p + "`=? and ";
            } else if(condition.oper == "equal") {
                if(condition.column == 'uuid') {
                    rawQuery += "`" + condition.column + "`=x? and ";
                    continue;
                }
                rawQuery += "`" + condition.column + "`=? and ";
            }
        }
        rawQuery = rawQuery.substring(0, rawQuery.length - 4);
    }

    this.rawQuery = rawQuery;
}

UpdateQuery.prototype.execute = function (ctx, node, args, callback) {
    var rawArgs = [];

    for(var i in this.query.columns) {
        var column = this.query.columns[i];
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

    if(this.query.conditions instanceof Array) {
        for(var i in this.query.conditions) {
            var condition = this.query.conditions[i];

            if(condition.oper == "param") {
                var param = condition.param;
                for (var p in param._param) {
                    rawArgs.push(ctx.param.get(param._param[p][0], param._param[p][1]));
                }
            } else if(condition.oper == "equal") {
                if(typeof condition.var == "function") {
                    rawArgs.push(condition.var(ctx, args));
                } else {
                    rawArgs.push(args[condition.var]);
                }
            }
        }
    }

    node.rawQuery(ctx, this.rawQuery, rawArgs, callback);
}

module.exports = UpdateQuery;
