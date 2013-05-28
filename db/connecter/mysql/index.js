var mysql = require('mysql');

module.exports = function(obj) {
    if(!obj.port) {
        obj.port = 3306;
    }

    var pool  = mysql.createPool({
        host     : obj.hostname,
        port     : obj.port,
        user     : obj.account,
        password : obj.password,
        database : obj.database
    });

    this.get = function (ctx) {
        if(!ctx) {
            return this;
        }

        return {
            query : function(str, arg, cb) {
                if(!cb) {
                    cb = arg;
                    arg = null;
                }
                pool.getConnection(function(err, conn) {
                    ctx.run(function() {
                        if(err) {
                            throw err;
                        }
                        conn.query(str, arg, function(err, rows) {
                            ctx.run(function() {
                                var e = null;
                                try {
                                    cb(err, rows);
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
        }
    };

    this.query = function(str, arg, cb) {
        if(!cb) {
            cb = arg;
            arg = null;
        }
        pool.getConnection(function(err, conn) {
            if(err) {
                throw err;
            }
            conn.query(str, arg, function(err, rows) {
                var e = null;
                try {
                    cb(err, rows);
                } catch(error) {
                    e = error;
                }
                conn.end();
                if(e) {
                    throw e;
                }
            });
        });
    }

    this.setTable = function(ctx, table, cb) {
        var query = "";
        query += "CREATE  TABLE `";
        query += table.name;
        query += "` (`uid` BIGINT NOT NULL , ";
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
        query += "PRIMARY KEY (`uid`))";

        pool.getConnection(function(err, conn) {
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
                            if(typeof(cb)=="function") {
                                cb(err, rows);
                            }
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
}