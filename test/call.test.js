var saram = require('saram-core');
var EventContext = require('saram-core/system/eventcontext/index.js');
var Call = require('saram-core/system/call/index.js');

describe('Call', function() {
    var server = null;
    var call_get = false;
    var call_post = false;
    var call_put = false;
    var call_delete = false;

    it('#Start', function(done) {
        server = saram();
        server.cache.addNode("memory:///");
        server.db.addNode("mysql://travis@127.0.0.1/saram_test");

        server.getCoreModule().addAction("test_get", function(ctx) {
            call_get = true;
            ctx.res.send({state:"OK"});
        });

        server.getCoreModule().addAction("test_post", function(ctx) {
            call_post = true;
            ctx.res.send({state:"OK"});
        });

        server.getCoreModule().addAction("test_put", function(ctx) {
            call_put = true;
            ctx.res.send({state:"OK"});
        });

        server.getCoreModule().addAction("test_delete", function(ctx) {
            call_delete = true;
            ctx.res.send({state:"OK"});
        });

        server.getCoreModule().addPipe({type:"GET", url:"/test_get", action:"test_get"});
        server.getCoreModule().addPipe({type:"POST", url:"/test_post", action:"test_post"});
        server.getCoreModule().addPipe({type:"PUT", url:"/test_put", action:"test_put"});
        server.getCoreModule().addPipe({type:"DELETE", url:"/test_delete", action:"test_delete"});

        server.protocol.addProtocol("http", { port : 7000 });
        server.start(done);
    });

    it('#Get', function(done) {
        Call.get(new EventContext(server, "saram.test.call", {}), "/test_get", {}, function(obj) {
            done(!test_get || obj.state != "OK" ? new Error("Call.get Error") : undefined);
        });
    });

    it('#Post', function(done) {
        Call.post(new EventContext(server, "saram.test.call", {}), "/test_post", {}, function(obj) {
            done(!test_post || obj.state != "OK" ? new Error("Call.post Error") : undefined);
        });
    });

    it('#Put', function(done) {
        Call.put(new EventContext(server, "saram.test.call", {}), "/test_put", {}, function(obj) {
            done(!test_put || obj.state != "OK" ? new Error("Call.put Error") : undefined);
        });
    });

    it('#Delete', function(done) {
        Call.delete(new EventContext(server, "saram.test.call", {}), "/test_delete", {}, function(obj) {
            done(!test_delete || obj.state != "OK" ? new Error("Call.delete Error") : undefined);
        });
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});