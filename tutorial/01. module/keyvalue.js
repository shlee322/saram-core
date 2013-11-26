var saram = require('saram-core');
var keyvalue = require('saram-core/modules/keyvalue');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.modules.load(keyvalue);
//모듈 오브젝트 생성, 사용
server.modules.use('elab.keyvalue', 'data', { name:"test_data" });
//URL 연결
server.modules.weld('data', 'data');

//프로토콜 지정
server.protocol.addProtocol("http");
//서버 시작
server.start();

