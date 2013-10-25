var request = require('request');

describe('Basic Module Test', function() {
    describe('Account', function() {
        var saram = require('saram-core');
        var accountModule = require('saram-core/modules/account/index.js');
        var userModule = require('saram-core/modules/user/index.js');
        var Call = require('saram-core/system/call/index.js');
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(accountModule);
            server.load(userModule);    

            server.use('elab.user', 'user');
            server.use('elab.account', 'account', {
                name:'account',
                user:'user'
            });
            server.weld('user','users');
            server.weld('account','account');
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
            Call.get(ctx, "/account/get_uuid", {id:"test"}, function(obj) {
                done(!obj.uuid ? new Error("UUID 취득 실패") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});