var mysql = require('mysql');

function Mysql(obj) {
    if(!obj.port) {
        obj.port = 3306;
    }

    this._pool  = mysql.createPool({
        host     : obj.hostname,
        port     : obj.port,
        user     : obj.account,
        password : obj.password,
        database : obj.database
    });
}

Mysql.prototype.getProtocol = function () {
    return "mysql";
}

Mysql.prototype.setTable = function (ctx, table) {
    var query = "";
    query += "CREATE  TABLE `";
    query += table.name;
    query += "` (`uuid` BIGINT NOT NULL , ";
    for(var column in table.columns) {
        var data = table.columns[column];

        query += "`" + column + "` ";
        if(data.type == "int64") {
            query += "BIGINT NOT NULL, ";
        } else if(data.type == "string") {
            query += "VARCHAR(" + data.length + ") NULL, ";
        }
    }
    for(var index in table.indexes) {
        var data = table.indexes[index];
        if(data.type != "INDEX") {
            query += data.type + " ";
        }
        query += "INDEX `" + data.name + "`(";

        for(var i in data.columns) {
            var column = data.columns[i];
            query += "`" + column[0] + "` " + column[1] + ", ";
        }
        query = query.substring(0, query.length - 2) + "), ";
    }
    query += "PRIMARY KEY (`uuid`))";

    //Content 생성
    this._pool.getConnection(function(err, conn) {
        ctx.run(function() {
            if(err) {
                throw err;
            }
            conn.query(query, function(err, rows) {
                ctx.run(function() {
                    var e = null;
                    try {
                        if(err && err.code != "ER_TABLE_EXISTS_ERROR") {
                        }
                        /*if(typeof(cb)=="function") {
                            cb(err, rows);
                        }*/
                    } catch(error) {
                        e = error;
                    }
                    conn.end();
                    if(e) {
                        throw e;
                    }
                });
            });
        });
    });
}

Mysql.prototype.setQuery = function (ctx, query) {
    var func = require('./query/' + query.action + ".js");
    return new func(ctx, query);
}

Mysql.prototype.rawQuery = function (ctx, query, data, callback) {
    if(!callback) {
        callback = data;
        data = null;
    }

    this._pool.getConnection(function(err, conn) {
        ctx.run(function() {
            if(err) {
                throw err;
            }
            conn.query(query, data, function(err, rows) {
                ctx.run(function() {
                    var e = null;
                    try {
                        callback(err, rows);
                    } catch(error) {
                        e = error;
                    }
                    conn.end();
                    if(e) {
                        throw e;
                    }
                });
            });
        });
    });
}

module.exports = Mysql;