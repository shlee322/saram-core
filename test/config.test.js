describe('Config File Test', function() {
    var saram = require('saram-core');

    it('#Start', function(done) {
        var server = saram({config:__dirname + '/config.xml'});
        server.start(done);
    });
});


