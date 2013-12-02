var request = require('request');
var saram = require('saram-core');
var facebookModule = require('saram-core/modules/facebook/index.js');
var userModule = require('saram-core/modules/user/index.js');
var Call = require('saram-core/system/call/index.js');
var EventContext = require('saram-core/system/eventcontext/index.js');

var client_id = "344345942352122";
var client_secret = "fa03d9cf4718ee254362def1689f9935";


describe('Basic Module Test', function() {
    describe('Facebook', function() {
        var server = null;
        var fb_token = "";

        it('#Init Facebook', function(done) {
            request.get("https://graph.facebook.com/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials", function (error, response, body) {
                request.get("https://graph.facebook.com/" + client_id + "/accounts/test-users?" + body, function (error, response, body) {
                    var data = JSON.parse(body);
                    fb_token = data.data[0].access_token;
                    done();
                });
            });
        });

        it('#Start', function(done) {
            server = saram();
            server.cache.addNode("memory:///");
            server.db.addNode("mysql://travis@127.0.0.1/saram_test");
            server.load(facebookModule);
            server.load(userModule);    

            server.use('elab.user', 'user');
            server.modules.use('elab.facebook', 'facebook', {
                client_id:client_id,
                client_secret:client_secret,
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
                if(error) {
                    return done(error);
                }
                done(response.statusCode!=200 ? new Error(body) : undefined);
            });
        });

        it('#getUUID', function(done) {
            Call.get(new EventContext(server, "saram.test.facebook", {}), "/facebook/get_uuid", {fb_id:"100006017199691"}, function(obj) {
                done(!obj.uuid ? new Error("UUID 취득 실패") : undefined);
            });
        });

        it('#Stop', function(done) {
            server.stop(done);
        });
    });
});
