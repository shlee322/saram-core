var request = require('request');

describe('Basic Module Test', function() {
    describe('Account', function() {
        var saram = require('saram-core');
        var accountModule = require('saram-core/modules/account/index.js');
        var userModule = require('saram-core/modules/user/index.js');
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(accountModule);
            server.load(userModule);

            server.use('elab.user', 'users');
            server.use('elab.account', 'account', {
                name:'account',
                user:'users'
            });
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        var access_token = "";

        it('#Signup', function(done) {
            request.post('http://127.0.0.1:7000/account/signup', {body:"id=test&pw=test"},  function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Signin', function(done) {
            request.post('http://127.0.0.1:7000/account/signin', {body:"id=test&pw=test"},  function (error, response, body) {
                if(response.statusCode!=200) {
                    done(new Error(body));
                    return;
                }

                var data = JSON.parse(body);
                access_token = data.access_token;
                done();
            });
        });

        it('#getUUID', function(done) {
            request.get('http://127.0.0.1:7000/account/get_uuid?access_token='+access_token, function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});