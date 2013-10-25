describe('Cache', function() {
    var saram = require('saram-core');
	var server = null;

    it('#Start', function(done) {
        server = saram();
        server.cache.addNode("memory:///");
        server.db.addNode("mysql://travis@127.0.0.1/saram_test");
        server.start(done);
    });

    it('#Set', function() {
        server.cache.set("test", "1234");
    });

    it('#Set-Callback', function(done) {
        server.cache.set("test", "1234", function(){done();});
    });

    it('#Get', function(done) {
        server.cache.get("test", function(value){
            done(value!="1234" ? new Error("넣었던 값과 다름") : undefined);
        });
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});