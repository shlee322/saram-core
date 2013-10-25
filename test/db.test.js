var request = require('request');
var saram = require('saram-core');
var EventContext = require('saram-core/system/eventcontext/index.js');
var DB = require('saram-core/system/db/index.js');

describe('DB', function() {
    var server = null;
    var module = {_dbQuery:{}, _dbTable:{}};

    it('#Start', function(done) {
        server = saram();
        server.cache.addNode("memory:///");
        server.db.addNode("mysql://travis@127.0.0.1/saram_test"); 

        server.start(done);
    });

    it('#SetTable', function(done) {
        var ctx = new EventContext(server, "saram.test.db", {});
        ctx.current = {module:module};

        DB.setTable(ctx, {
            name : "dbtest_test",
            columns : {
                test : {type:"string"}
            }
        });
        done();
    });

    it('#SetQuery', function(done) {
        var ctx = new EventContext(server, "saram.test.db", {});
        ctx.current = {module:module};

        DB.setQuery(ctx, {
            name : "db.test",
            action : 'insert',
            table : "dbtest_test",
            columns : {
                test : 'test'
            }
        });
        done();
    });

    it('#Execute', function(done) {
        var ctx = new EventContext(server, "saram.test.db", {});
        ctx.current = {module:module};

        DB.execute(ctx, 'db.test', { test:"1234" }, function (err, rows) {
            done(err ? err : undefined);
        });
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});
