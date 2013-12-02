var saram = require('saram-core');
var EventContext = require('saram-core/system/eventcontext/index.js');
var Cache = require('saram-core/system/cache/index.js');

describe('Redis', function() {
    
	var server = null;

    it('#Start', function(done) {
        server = saram();
        server.cache.addNode("redis:///");
        server.db.addNode("mysql://travis@127.0.0.1/saram_test");
        server.start(done);
    });

    it('#Set', function() {
        Cache.set(new EventContext(server, "saram.test.cache", {}), "test", "1234");
    });

    it('#Set-Callback', function(done) {
        Cache.set(new EventContext(server, "saram.test.cache", {}), "test", "1234", function(){done();});
    });

    it('#Get', function(done) {
        Cache.get(new EventContext(server, "saram.test.cache", {}), "test", function(value){
            done(value!="1234" ? new Error("넣었던 값과 다름") : undefined);
        });
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});
