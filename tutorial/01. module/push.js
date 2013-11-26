var saram = require('saram-core');
var push = require('saram-core/modules/push');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.modules.load(push);
//모듈 오브젝트 생성, 사용
server.modules.use('elab.push', 'push', {
    name:"push",
    service:{
        gcm:{
            type:"gcm",
            key:""
        }
    }
});
//URL 연결
server.weld('push', 'push');

//프로토콜 지정
server.protocol.addProtocol("http");
//서버 시작
server.start();

