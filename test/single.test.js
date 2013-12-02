var request = require('request');

describe('Basic Module Test', function() {
    describe('Single', function() {
        var saram = require('saram-core');
        var singleModule = require('saram-core/modules/single/index.js');
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(singleModule);

            server.use('elab.single', 'single_test', { name:"single_test" });
            server.weld('single_test', 'data');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        var itemUUID = "";

        it('#Set', function(done) {
            request.post('http://127.0.0.1:7000/data/', {body:"value=test"},  function (error, response, body) {
                if(response.statusCode!=200) {
                    done(new Error(body));
                    return;
                }

                var data = JSON.parse(body);
                itemUUID = data.uuid;
                done();
            });
        });

        it('#Get', function(done) {
            request.get('http://127.0.0.1:7000/data/',  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Update', function(done) {
            request.put('http://127.0.0.1:7000/data/', {body:"value=1234"},  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Delete', function(done) {
            request.del('http://127.0.0.1:7000/data/', function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});
