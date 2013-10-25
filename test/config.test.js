describe('Config File Test', function() {
    var saram = require('saram-core');
    var server = null;
    it('#Start (Load Database + Cache + Module Content + Module + Receiver Custom Module + Protocol)', function(done) {
        server = saram({config:__dirname + '/config.xml'});
        server.start(done);
    });

    it('#Stop', function(done) {
        server.stop(done);
    });
});


