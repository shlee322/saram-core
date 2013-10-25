var request = require('request');

describe('Basic Module Test', function() {
    describe('Manager', function() {
        var saram = require('saram-core');
        var server = null;
        it('#Start', function(done) {
            server = saram({manager:'admin'});
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        it('#Stop', function(done) {
            server.stop(done);
        });

    });
});