describe('Config File Test', function() {
    var saram = require('saram-core');

    it('#Start', function() {
        var server = saram({config:__dirname + '/config.xml'});
        server.start();
    });
});


