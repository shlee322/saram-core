var request = require('request');
var saram = require('saram-core');
var userModule = require('saram-core/modules/user/index.js');
var Call = require('saram-core/system/call/index.js');
var EventContext = require('saram-core/system/eventcontext/index.js');

describe('Basic Module Test', function() {
    describe('User', function() {
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(userModule);    

            server.use('elab.user', 'user');
            server.weld('user','users');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        var access_token = "";

        it('#Signin', function(done) {
            Call.post(new EventContext(server, "saram.test.user", {}), "/users/signin", {data:{uuid:"1111"}}, function(obj) {
                access_token = obj.access_token;
                done(!obj.access_token ? new Error("Access Token 할당 실패") : undefined);
            });
        });

        it('#My UUID(GET UUID)', function(done) {
            Call.get(new EventContext(server, "saram.test.user", {}), "/users/my_uuid", {access_token:access_token}, function(obj) {
                done(obj.uuid != "1111" ? new Error("My UUID Error") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});