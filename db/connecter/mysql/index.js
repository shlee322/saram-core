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
}