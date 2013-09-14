describe('Basic Module Test', function() {
    describe('List', function() {
        var saram = require('saram-core');
        var listModule = require('saram-core/modules/list/index.js');

        it('start', function() {
            var server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.modules.load(listModule);

            server.modules.use('elab.list', 'list_test', { name:"list_test" });
            server.modules.weld('list_test', 'list');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start();
        });
    });
});