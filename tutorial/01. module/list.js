var saram = require('saram-core');
var listModule = require('saram-core/modules/list');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.modules.load(listModule);
//모듈 오브젝트 생성, 사용
server.modules.use('elab.list', 'list_test', { name:"test_list" });
//URL 연결
server.modules.weld('list_test', 'list');

//프로토콜 지정
server.protocol.addProtocol("http");
//서버 시작
server.start();

