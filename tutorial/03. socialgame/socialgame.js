var saram = require('saram-core');
var Call = require('saram-core/system/call/index.js');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.load(require('saram-core/modules/list'));
server.load(require('saram-core/modules/keyvalue'));
server.load(require('saram-core/modules/social'));
server.load(require('saram-core/modules/user'));
server.load(require('saram-core/modules/account'));
server.load(require('saram-core/modules/push'));

//모듈 오브젝트 생성, 사용
server.use('elab.user', 'users');
server.use('elab.keyvalue', 'user_data', {
    name:"user_data",
    param : [['users','uuid']]
});
server.use('elab.account', 'account', {
    name:'account',
    user:'users'
});
server.use('elab.social', 'social');
server.use('elab.keyvalue', 'score', {
    name:"user_score",
    param : [['users','uuid']],
    list:true
});

//URL 연결
server.weld('users', 'users');
server.weld('social', 'social');
server.weld('users', 'user_data', 'data');
server.weld('account', 'account');
server.weld('users', 'score', 'score');

//이벤트 리시버 추가
server.addReceiver(null, 'call.root.before', 'users', 'auth');
server.addReceiver('user_data', 'call.set.before', 'users', 'myonly');
server.addReceiver('score', 'call.get.before', 'users', 'myonly');

server.getCoreModule().addAction("set_score", function(ctx) {
    var _this = this;
    ctx.current.authNext = false;

    ctx.req.data.readKey(["score"], function() {
        var score = ctx.req.data.getValue("score", '0');

        ctx.errorTry(!score, Error); // 'score.notfound'
        ctx.errorTry(!ctx.auth, Error); // 'autherror'

        Call.get(ctx, "/user/" + ctx.auth + "/score/" + ctx.auth, {}, function(obj){
            ctx.errorTry(!obj.error && parseInt(obj.value) >= parseInt(score), Error); // 'score.max'

            Call.get(ctx, "/social/" + ctx.auth + "/box/list", {}, function(obj){
                ctx.errorTry(obj.error, Error);

                for(var i in obj.target) {
                    var target = obj.target[i];
                    Call.post(ctx, "/users/" + target + "/score/" + ctx.auth, {data:{value:score}}, function(obj){});
                }
                ctx.res.send({state:'OK'}); //차후 모든 승인 이후에 하게
            });
        });
    });
});

server.getCoreModule().addPipe({type:"POST", url:"/set_score", viewer:"set_score"});

server.getCoreModule().addAction("add_friend", function(ctx) {
    ctx.current.autoNext = false;
    ctx.req.data.readKey(["friend"], function() {
        var friend = ctx.req.data.getValue("friend");

        ctx.errorTry(!ctx.auth, Error); //auth.error'
        ctx.errorTry(!friend, Error);

        Call.get(ctx, "/account/get_uuid", {id:friend}, function(obj) {
            ctx.errorTry(obj.error, Error); //'friend.notfound'
            ctx.errorTry(obj.uuid == ctx.auth, Error); //'myid'

            Call.post(ctx, "/social/add_following", {data:{object:ctx.auth, target:obj.uuid}}, function(obj) {
                ctx.errorTry(obj.error, obj.error);
                ctx.res.send({state:'OK'});
                ctx.current.next();
            });
        });
    });
});

server.getCoreModule().addPipe({type:"POST", url:"/add_friend", viewer:"add_friend"});

server.addReceiver('saram.core', 'call.set_score.before', 'users', 'auth');
server.addReceiver('saram.core', 'call.add_friend.before', 'users', 'auth');

//프로토콜 지정
server.protocol.addProtocol("http");
server.start();