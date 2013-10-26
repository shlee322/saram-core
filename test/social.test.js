var request = require('request');
var saram = require('saram-core');
var listModule = require('saram-core/modules/list/index.js');
var socialModule = require('saram-core/modules/social/index.js');
var Call = require('saram-core/system/call/index.js');
var EventContext = require('saram-core/system/eventcontext/index.js');

describe('Basic Module Test', function() {
    describe('Social', function() {
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(listModule);
            server.load(socialModule);    

            server.use('elab.social', 'social');
            server.weld('social','social');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        var uuid_1="";
        var uuid_2="";
        var uuid_3="";

        it('#Create UUID 1', function(done) {
            server.uuid.generate(function (uuid){
                uuid_1 = uuid;
                done();
            });
        });

        it('#Create UUID 2', function(done) {
            server.uuid.generate(function (uuid){
                uuid_2 = uuid;
                done();
            });
        });

        it('#Create UUID 3', function(done) {
            server.uuid.generate(function (uuid){
                uuid_3 = uuid;
                done();
            });
        });

        it('#Add Following', function(done) {
            Call.post(new EventContext(server, "saram.test.social", {}), "/social/add_following", {data:{object:uuid_2, target:uuid_1}}, function(obj) {
                Call.post(new EventContext(server, "saram.test.social", {}), "/social/add_following", {data:{object:uuid_3, target:uuid_1}}, function(obj) {
                    done();
                });
            });
        });

        it('#Box List', function(done) {
            Call.get(new EventContext(server, "saram.test.social", {}), "/social/"+uuid_1+"/box/list", {}, function(obj){
                done(obj.target.length != 3 ? new Error("Box List Length Error") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});
