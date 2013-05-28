var snowflake = require('snowflake-node');
var url = require('url');

module.exports = function(saram) {
    return new newDB(saram);
}

function newDB(saram) {
    this.saram = saram;
    this.addNode = addNode;
    this.setTable = setTable;
    this.query = temp_query;

    this.cluster = {};

    this.utill = {
        paramToColumns : function (columns, param, type) {
            for(var i in param) {
                columns[param[i][0] + "_" + param[i][1]] = type;
            }
        },
        paramToIndexColumns : function (indexColumns, param, type) {
            if(!type) {
                type = "ASC";
            }
            for(var i in param) {
                indexColumns.push([param[i][0] + "_" + param[i][1], type]);
            }
        }
    };
}

function addNode(nodeUrlStr, clusterName) {
    if(!clusterName) {
        clusterName = 'default';
    }

    var nodeUrl = url.parse(nodeUrlStr);

    if(!nodeUrl.protocol) {
        console.log("프로토콜이 정의되지 않았습니다.");
        return;
    }

    var protocol = nodeUrl.protocol.substring(0, nodeUrl.protocol.length - 1);
    var hostname = nodeUrl.hostname;
    var port = nodeUrl.port;
    if(!port) {
        port = null;
    }

    var account = null;
    var passwd = null;
    if(nodeUrl.auth) {
        var pwIndex = nodeUrl.auth.indexOf(':');
        if(pwIndex != -1) {
            account = nodeUrl.auth.substring(0,pwIndex);
            passwd = nodeUrl.auth.substring(pwIndex + 1);
        } else {
            account = nodeUrl.auth;
        }
    }

    var database = nodeUrl.path.substring(1);

    var connecterObj = require('./connecter/' + protocol + '/');
    var connecter = new connecterObj({
        hostname : hostname,
        port : port,
        account : account,
        password : passwd,
        database : database
    });

    if(!this.cluster[clusterName]) {
        this.cluster[clusterName] = [];
    }

    this.cluster[clusterName].push(connecter);
}

function temp_query(sharedKey, func, clusterName, ctx) {
    if(!clusterName) {
        clusterName = 'default';
    }

    var cluster = this.cluster[clusterName];

    if(sharedKey) {
        this.saram.sharding(sharedKey, cluster.length, function(node) {
            func(cluster[node].get(ctx));
        });
    } else {
        for(var node in cluster) {
            func(cluster[node].get(ctx));
        }
    }
}

function addQuery(queryName, func) {
}

function execute(queryName, obj) {
}

function setTable(ctx, data) {
    if(typeof(data.name) != "string") {
        throw new Error();
    }
    if(typeof(data.name) != "string") {
        throw new Error();
    }
    var clusterName = 'default';
    if(typeof(data.shardKey) == "string") {
        data.shardKey = function() {return 0;}
    }
    if(typeof(data.shardKey) != "function") {
        throw new Error();
    }
    if(typeof(data.columns) != "object") {
        throw new Error();
    }
    if(!(data.indexes instanceof Array)) {
        data.indexes = [];
    }
    for(var i in data.columns) {
        var column = data.columns[i];
        if(typeof(column) == "string") {
            data.columns[i] = { type : column };
            column = data.columns[i];
        }
        if(typeof(column) != "object") {
            throw new Error();
        }

        if(column.type != "string" &&
            column.type != "int64" &&
            column.type != "sha256") {
            throw new Error();
        }

        if(column.type == "string" && !column.length) {
            column.length = 64;
        }
    }

    for(var i in data.indexes) {
        var index = data.indexes[i];
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

    //전체 노드 호출
    //ctx.runWait();
    var cluster = this.cluster[clusterName];
    for(var node in cluster) {
        cluster[node].setTable(ctx, data);
    }
}