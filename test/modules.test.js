var request = require('request');

describe('Modules', function() {
    var saram = require('saram-core');
    var keyvauleModule = require('saram-core/modules/keyvalue/index.js');
    var server = null;

    it('#Init', function(done) {
        server = saram();
        server.cache.addNode("memory:///");
        server.db.addNode("mysql://travis@127.0.0.1/saram_test");
        server.getCoreModule().addAction("testReceiver", function(ctx) {
            ctx.res.send({test:1234});
        });
        done();
    });

    it('#Load', function(done) {
        server.modules.load(keyvauleModule);
        done();
    });

    it('#Use', function(done) {
        server.modules.use('elab.keyvalue', 'test', { name:"modules_test" });
        done();
    });

    it('#Get', function(done) {
        done(!server.modules.get('test') ? new Error("모듈 객체 취득 실패") : undefined);
    });

    it('#Weld', function(done) {
        server.modules.weld('test', 'test');
        done();
    });

    it('#Add Receiver', function(done) {
        server.modules.addReceiver("test", "call.get.before", "saram.core", "testReceiver");
        done();
    });

    it('#Start', function(done) {
        server.protocol.addProtocol("http", { port : 7000 });
        server.start(done);
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});