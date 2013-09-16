var Param = require('./param.js');
var Log = require('../log/index.js');

exports.setTable = function (ctx, table) {
    ctx.errorTry(typeof(table.name) != "string", Error);

    if(typeof(table.shardKey) == "string" || !table.shardKey)
        table.shardKey = function () {return 0;}
    ctx.errorTry(typeof(table.shardKey) != "function", Error);
    ctx.errorTry(typeof(table.columns) != "object", Error);

    if(!(table.indexes instanceof Array))
        table.indexes = [];

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

    var removeIndex = [];
    for(var i in table.indexes) {
        var index = table.indexes[i];
        if(!index) {
            removeIndex.push(index);
            continue;
        }
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

    for(var i in removeIndex) {
        //삭제
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

    //파티셔닝
    if(!query.partitioner) {
        var HashShard = require('./partitioners/hashshard/index.js');
        query.partitioner = new HashShard();
    }

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

    if(Log.isView(ctx, Log.LEVEL.DEBUG)) Log.debug(ctx, "Call DB Execute " + module.getMid() + " " + query);

    if(!query)
        return callback();

    var clusterName = "default";

    var cluster = ctx.getSaram().db.getCluster(clusterName);

    return query.query.partitioner.execute(ctx, query, cluster, args, callback);
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
