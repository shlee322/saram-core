Saram Framework [![Build Status](https://travis-ci.org/shlee322/saram-core.png?branch=master)](https://travis-ci.org/shlee322/saram-core) [![Coverage Status](https://coveralls.io/repos/shlee322/saram-core/badge.png)](https://coveralls.io/r/shlee322/saram-core)
==================
[공식사이트](http://saram.elab.kr)

[튜토리얼](https://github.com/shlee322/saram-core/tree/master/tutorial)

사용자는 Saram Framework를 사용하여 손쉽게 Restful 서버를 개발할 수 있습니다.

설치 : `npm install saram-core`

app.js
```javascript
var saram = require('saram-core');

var server = saram();
server.start(function() {
    console.log("Start");
});
```

saram.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<saram>
    <database>
        <node>mysql://test:test@127.0.0.1/test</node>
    </database>
    <module>
        <module name='elab.list' mid='test' path='test'>
            <config>"name":"test"</config>
        </module>
    </module>
</saram>
```

각 모듈의 자세한 사용법은 모듈 디렉토리 내의 README를 참고하십시오.
