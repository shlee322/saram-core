var request = require('request');

var fb_token = "CAAE5LkmS4PoBAEpd9tMKn9xCrIRzM758jlZCBu0Ly1tGfZBuLMVHTTuZBYsnvGQ0YGWVE3xMy9Uf5SKQqCU75ZBOlx7TNetQqXC9t5h7VpbZBSi9FHLFY7Nk7LQzf8yTdzNSKuevPQhHzgVpGSRJl1zhkoFLLr7YxG3WFcKkPuAoUVzSYEEli23kqj16VoL6WTLDZCKp3gKgZDZD";

describe('Basic Module Test', function() {
    describe('Facebook', function() {
        var saram = require('saram-core');
        var FacebookModule = require('saram-core/modules/facebook/index.js');
        var userModule = require('saram-core/modules/user/index.js');
        var Call = require('saram-core/system/call/index.js');
        var server = null;

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(facebookModule);
            server.load(userModule);    

            server.use('elab.user', 'user');
            server.modules.use('elab.facebook', 'facebook', {
                client_id:'344345942352122',
                client_secret:'secret',
                url:'http://127.0.0.1:7000/facebook',
                state:'',
                user:'user'
            });
            server.weld('user','users');
            server.weld('facebook','facebook');
            server.protocol.addProtocol("http", { port : 7000 });

            server.start(done);
        });

        it('#Auth', function(done) {
            request.get('http://127.0.0.1:7000/facebook/auth?fb_token=' + fb_token, function (error, response, body) {
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#getUUID', function(done) {
            Call.get(ctx, "/facebook/get_uuid", {fb_id:"100006017199691"}, function(obj) {
                done(!obj.uuid ? new Error("UUID 취득 실패") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});