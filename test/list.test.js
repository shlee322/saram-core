var request = require('request');

describe('Basic Module Test', function() {
    describe('List', function() {
        var saram = require('saram-core');
        var listModule = require('saram-core/modules/list/index.js');

        it('#Start', function(done) {
            var server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.modules.load(listModule);

            server.modules.use('elab.list', 'list_test', { name:"list_test" });
            server.modules.weld('list_test', 'list');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        var itemUUID = "";

        it('#Insert', function(done) {
            request.post('http://127.0.0.1:7000/list/', {body:"value=test"},  function (error, response, body) {
                if(response.statusCode!=200) throw new Error(body);
                var data = JSON.parse(body);
                itemUUID = data.uuid;
                done();
            });
        });

        it('#Get', function(done) {
            request.get('http://127.0.0.1:7000/list/' + itemUUID,  function (error, response, body) {
                if(response.statusCode!=200) throw new Error(body);
                done();
            });
        });

        it('#Update', function(done) {
            request.put('http://127.0.0.1:7000/list/' + itemUUID, {body:"value=1234"},  function (error, response, body) {
                if(response.statusCode!=200) throw new Error(body);
                done();
            });
        });

        it('#List', function(done) {
            request.get('http://127.0.0.1:7000/list/',  function (error, response, body) {
                if(response.statusCode!=200) throw new Error(body);
                done();
            });
        });

        it('#Delete', function(done) {
            request.del('http://127.0.0.1:7000/list/' + itemUUID, function (error, response, body) {
                if(response.statusCode!=200) throw new Error(body);
                done();
            });
        });
    });
});