var request = require('request');
var saram = require('saram-core');
var listModule = require('saram-core/modules/list/index.js');
var pushModule = require('saram-core/modules/push/index.js');
var Call = require('saram-core/system/call/index.js');
var EventContext = require('saram-core/system/eventcontext/index.js');

var gcmServerKey = "TESTTEST";
var device = "TEST_DEVICE";

describe('Basic Module Test', function() {
    describe('Push', function() {
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(listModule);
            server.load(pushModule);

            server.use('elab.push', 'push', {
                name:"push",
                service:{
                    gcm:{
                        type:"gcm",
                        key:gcmServerKey
                    }
                }
            });
            server.weld('push','push');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        it('#Add Service', function(done) {
            Call.post(new EventContext(server, "saram.test.push", {}), "/push/add/gcm", {data:{device:device}}, function(obj) {
                done(!obj.state ? new Error("Add Service Error") : undefined);
            });
        });

        it('#Send', function(done) {
            Call.post(new EventContext(server, "saram.test.push", {}), "/push/send", {data:{data:"test"}}, function(obj) {
                done(obj.data[0].error.indexOf("Unauthorized") == -1 ? new Error("Send Test Error") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});
