var saram = require('saram-core');
var userModule = require('saram-core/modules/user');
var facebookModule = require('saram-core/modules/facebook');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.modules.load(userModule);
server.modules.load(facebookModule);
server.modules.use('elab.user', 'users');
server.modules.use('elab.facebook', 'facebook', {
    client_id:'344345942352122',
    client_secret:'secret',
    url:'http://127.0.0.1/facebook',
    state:'',
    user:'users'
});
//URL 연결
server.modules.weld('users', 'users');
server.modules.weld('facebook', 'facebook');

//프로토콜 지정
server.protocol.addProtocol("http");
//서버 시작
server.start();

