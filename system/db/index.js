var Param = require('./param.js');

exports.setTable = function (ctx, table) {
    ctx.errorTry(typeof(table.name) != "string", Error);

    if(typeof(table.shardKey) == "string" || !table.shardKey)
        table.shardKey = function () {return 0;}
    ctx.errorTry(typeof(table.shardKey) != "function", Error);
    ctx.errorTry(typeof(table.columns) != "object", Error);

    if(!(table.indexes instanceof Array))
        table.indexes = [];

    if(table.param instanceof Array)
        table.param = new Param(table.param);
    if(!(table.param instanceof Param))
        table.param = new Param();

    var temp = table.columns;
    table.columns = {};
    table.param.toColumns(table.columns, "int64");
    for(var i in temp)
        table.columns[i] = temp[i];

    for(var i in table.columns) {
        var column = table.columns[i];
        if(typeof(column) == "string") {
            table.columns[i] = { type : column };
            column = table.columns[i];
        }
        ctx.errorTry(typeof(column) != "object", Error);
        ctx.errorTry(
            column.type != "string" &&
            column.type != "int64" &&
            column.type != "sha256", Error);

        if(column.type == "string" && !column.length) {
            column.length = 64;
        }
    }

    var paramIndex = table.param.getIndex();
    if(paramIndex)
        table.indexes.push(paramIndex);

    for(var i in table.indexes) {
        var index = table.indexes[i];
        if(!index.type) {
            index.type = "INDEX";
        }

        for(var columns_index in index.columns) {
            var column = index.columns[columns_index];
            if(typeof(column)=="string") {
                index.columns[columns_index] = [column ,"ASC"];
            }
        }
    }

    var clusterName = 'default';
    //전체 노드 호출
    //ctx.runWait();
    var cluster = ctx.getSaram().db.getCluster(clusterName);
    for(var node in cluster) {
        cluster[node].setTable(ctx, table);
    }

    ctx.current.module._dbTable[table.name] = table;
}

exports.setQuery = function (ctx, query) {
    var clusterName = "default";
    var cluster = ctx.getSaram().db.getCluster(clusterName);

    var module = ctx.current.module;

    for(var node in cluster) {
        var protocol = cluster[node].getProtocol();
        var queryList = module._dbQuery[query.name];
        if(!queryList) {
            queryList = { query:query, protocol:{} };
            module._dbQuery[query.name] = queryList;
        }

        if(module._dbQuery[query.name].protocol[protocol])
            continue;

        module._dbQuery[query.name].protocol[protocol] = cluster[node].setQuery(ctx, query);
    }
}

exports.execute = function (ctx, query, args, callback) {
    var module = ctx.current.module;
    var query = module._dbQuery[query];
    if(!query)
        return callback();

    var clusterName = "default";

    var cluster = ctx.getSaram().db.getCluster(clusterName);
    return query.protocol[cluster[0].getProtocol()].execute(ctx, cluster[0], args, callback);
}

exports.rawQuery = function (ctx, sharedKey, func, clusterName) {
    clusterName = clusterName ? clusterName : "default";

    var cluster = ctx.getSaram().db.getCluster(clusterName);

    if(sharedKey) {
        ctx.getSaram().uuid.sharding(sharedKey, cluster.length, function(node) {
            func(cluster[node]);
        });
    } else {
        for(var node in cluster) {
            func(cluster[node]);
        }
    }
}