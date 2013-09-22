var request = require('request');

describe('Basic Module Test', function() {
    describe('KeyValue', function() {
        var saram = require('saram-core');
        var keyvauleModule = require('saram-core/modules/keyvalue/index.js');

        it('#Start', function(done) {
            var server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.modules.load(keyvauleModule);

            server.modules.use('elab.keyvalue', 'keyvalue_test', { name:"keyvalue_test" });
            server.modules.weld('keyvalue_test', 'keyvalue');
            server.protocol.addProtocol("http", { port : 7002 });

            server.start(done);
        });

        it('#Set(Insert)', function(done) {
            request.post('http://127.0.0.1:7002/keyvalue/test', {body:"value=test"},  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Get', function(done) {
            request.get('http://127.0.0.1:7002/keyvalue/test',  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Set(Update)', function(done) {
            request.post('http://127.0.0.1:7002/keyvalue/test', {body:"value=1234"},  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });
    });
});