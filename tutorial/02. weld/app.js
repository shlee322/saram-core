var saram = require('saram-core');
var list = require('saram-core/modules/list');
var keyvalue = require('saram-core/modules/keyvalue');

var server = saram();
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");

//모듈 로드
server.load(list);
server.load(keyvalue);
//모듈 오브젝트 생성, 사용
server.use('elab.list', 'list', { name:"test_weld_list" });
server.use('elab.keyvalue', 'map', { name:"test_weld_list_map", param:[["list","uid"]] });
//URL 연결
server.weld('list', 'list');
server.weld('list', 'map', 'map');

//프로토콜 지정
server.protocol.addProtocol("http");
//서버 시작
server.start();

