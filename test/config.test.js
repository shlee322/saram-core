describe('Config File Test', function() {
    var saram = require('saram-core');
    var server = null;
    it('#Start', function(done) {
        server = saram({config:__dirname + '/config.xml'});
        server.start(done);
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});


