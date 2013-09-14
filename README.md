Saram Framework [![Build Status](https://travis-ci.org/saramjs/saram-core.png?branch=master)](https://travis-ci.org/saramjs/saram-core) [![Coverage Status](https://coveralls.io/repos/saramjs/saram-core/badge.png)](https://coveralls.io/r/saramjs/saram-core)
==================
[공식사이트](http://saram.elab.kr)   [튜토리얼](https://github.com/saramjs/saram-tutorial)

Saram Framework는 손쉽게 스케일아웃한 Restful 서버를 개발할 수 있게 도와주는 프레임워크입니다.

사용자는 본 프레임워크를 사용하여 Restful 서버나 홈페이지를 제작 할 수 있습니다.

설치 : `npm install saram-core`

```javascript
var saram = require('saram-core');
var server = saram();
//Cache, DB Node 추가
server.cache.addNode("memory:///");
server.db.addNode("mysql://test:testtest@localhost/test");
//모듈 로드
server.load(require('saram-core/modules/list'));
//모듈 오브젝트 생성, 사용
server.use('elab.list', 'list_test', { name:"test_list" });
//URL 연결
server.weld('list_test', 'list');
server.protocol.addProtocol("http");
//서버 시작
server.start();
// GET /list/ - 리스트 출력
// POST /list/  value:'test' - 리스트에 'test' 추가
// POST /list/(uuid) - 아이템 편집
// DELETE /list/(uuid) - 아이템 삭제
// 그 외 정보는 상세 문서 확인
// 차후 설정파일을 통해 설정가능하게 개발
```

위와 같은 간단한 코드를 통해 Restful로 접근가능한 List 서버를 개발할 수 있습니다.

Saram Framework는 기본적으로 List Module을 포함한 다음과 같은 모듈을 제공하고 있고 계속 추가될 예정입니다.

* Account
* Facebook
* KeyValue
* List
* Manager
* Push
* Social
* Static
* User