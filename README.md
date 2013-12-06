Saram Framework [![Build Status](https://travis-ci.org/shlee322/saram-core.png?branch=master)](https://travis-ci.org/shlee322/saram-core) [![Coverage Status](https://coveralls.io/repos/shlee322/saram-core/badge.png)](https://coveralls.io/r/shlee322/saram-core)
==================
[공식사이트](https://github.com/shlee322/saram-core)

[튜토리얼](https://github.com/shlee322/saram-core/tree/master/tutorial)

사용자는 Saram Framework를 사용하여 손쉽게 Restful 서버를 개발할 수 있습니다.

Get Started
---------------------------
[![NPM](https://nodei.co/npm/saram-core.png)](https://nodei.co/npm/saram-core/)

앞으로 서버 프로젝트를 저장할 디렉토리를 생성한 이후 해당 디렉토리 안에서 다음 순서를 진행합니다.

설치 : `npm install saram-core`

아래 코드는 Root Module 안에 List Module을 연결(Weld)하여 서버를 구성한 예제입니다.

`GET /test/`를 통하여 리스트에 접근 할 수 있습니다.

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

간편 실행 : `node ./node_modules/saram-core/tools/app.js -c saram.xml`

`-c saram.xml`은 생략이 가능한 설정파일을 로드하는 `-c <path>`의 기본값입니다.


각 모듈의 자세한 사용법은 각 모듈 디렉토리 내의 README를 참고하십시오.

- [List Module](https://github.com/shlee322/saram-core/tree/master/modules/list/README.md)
- [KeyValue Module](https://github.com/shlee322/saram-core/tree/master/modules/keyvalue/README.md)
- [Single Module](https://github.com/shlee322/saram-core/tree/master/modules/single/README.md)
- [Account Module](https://github.com/shlee322/saram-core/tree/master/modules/account/README.md)
- [User Module](https://github.com/shlee322/saram-core/tree/master/modules/user/README.md)
- [Facebook Module](https://github.com/shlee322/saram-core/tree/master/modules/facebook/README.md)
- [Push Module](https://github.com/shlee322/saram-core/tree/master/modules/push/README.md)
- [Simauth Module](https://github.com/shlee322/saram-core/tree/master/modules/simauth/README.md)
- [Social Module](https://github.com/shlee322/saram-core/tree/master/modules/social/README.md)


Config File
--------------------------
Saram Framework는 사용자의 편의를 위해 XML을 통해 모듈등을 제작 할 수 있도록 개발되었습니다.

saram.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<saram>
    <database>
        <node>mysql://test:test@127.0.0.1/test</node>
    </database>
    <module>
        <module name='elab.keyvalue' mid='data' path='data'>
            <config>"name":"data"</config>
            <action name='setDataAction'>
                var val = ctx.req.body.getValue('a', '') + ctx.req.body.getValue('b', '');
                ctx.req.body.setValue('value', val);
            </action>
            <receiver event='call.set.before' receiver='data' action='setDataAction'/>
        </module>
    </module>
</saram>
```
위의 내용은 기존 KeyValue 모듈의 set Action 실행 전에
setDataAction을 호출하여 set Action으로 넘어가는 데이터를 조작하는 예제입니다.

| API                                   | Desc                                              |
|---------------------------------------|---------------------------------------------------|
| ctx.req.body.getValue(key[, default]) | Request Body에서 해당 Key를 가진 Value를 리턴.    |
|                                       | 단, Value를 찾지 못할 경우 default를 리턴         |
| ctx.req.body.setValue(key, value)     | 인자로 입력받은 Value을 Request Body의 Key에 대입 |

위 예제의 saram.xml을 로드한 서버에 HTTP를 통하여

```
POST /data/test
a=test&b=1234
```

위와 같은 요청을 보내면 test라는 key에 ‘test1234’라는 value가 입력되게 됩니다.

위 Action에 `if(ctx.req.param.key == 'name')`와 같이 if문을 추가하면
key가 name일 때만 a+b의 값이 입력되게 됩니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<saram>
    <database>
        <node>mysql://test:test@127.0.0.1/test</node>
    </database>
    <module>
        <action name='test'>
            ctx.res.send({test:'1234'});
        </action>
        <pipe type='GET' url='/test' action='test'/>
    </module>
</saram>
```
그 외에도 다음과 같은 방식으로 pipe와 action을 설정하면
`GET /test` 요청을 하게 되면 `{test:'abcd'}` 응답을 주게 됩니다.

`<action name='test' file='test.js'/>`

그 외에도 xml에 직접 javascript를 삽입 할 수 있지만 위와 같이 js 파일을 로드하여 처리가 가능합니다.

Action & Event
---------------------------
Action이란 Saram Framework에서 작동을 구분하기 위한 단위이며 Javascript의 함수로 구성됩니다.

Saram Framework에서 호출되는 모든 액션의 호출 전에는 `call.actionName.before` 이벤트가 호출되며
액션이 실행 완료되면 `call.actionName.after`이 이벤트가 호출됩니다.

Event 또한 Action(Receiver)의 집합이며 이벤트 호출시 이벤트에 등록된 Action(Receiver)들이 등록된 순서대로 작동됩니다.

Rceiver 또한 Action으로 취급하여 Action와 완벽하게 동일한 호출 구조를 지니고 있습니다.

이를 통하여 이벤트들을 중첩적으로 구현할 수 있습니다.

Pipe
---------------------------
Pipe는 Request가 어느 Action을 호출해야하는지 알려주는 지표 역할을 합니다.

Pipe의 종류에는 GET, POST, PUT, DELETE, WELD가 존재하며 WELD를 제외한 4가지는 HTTP의 Method와 일맥상통합니다.

WELD는 모듈과 모듈을 연결하는 용도로 사용됩니다.

Routine
---------------------------
클라이언트로부터 Restful 요청이 들어오면 Saram Framework는
Root Module(Saram Core Module)로부터 Pipeline을 생성합니다.

Pipeline는 해당 요청이 들어오면 처리될 Pipe의 큐입니다.

saram.xml 일부
```xml
<module>
    <module name='elab.user' mid='user' path='users'>
        <module name='elab.keyvalue' mid='user_info' path='info'>
            <config>"name":"user_info","param":[["user","uuid"]]</config>
        </module>
    </module>
    <module name='elab.account' mid='account' path='account'>
        <config>"name":"account","user":"user"</config>
    </module>
</module>
```
위와 같이 설정 파일을 설정하는 경우 모듈들은 다음과 같이 상속되는 구조를 가지게 됩니다.

```
Root Module(saram.core) > users(user)          > info(user_info)
                        > account(account)
```
이 설정 파일을 로드한 서버에 HTTP를 통하여 `GET /users/my/info/name`를 호출할 경우
다음과 같이 URL을 분석하여 Pipeline를 만들게 됩니다.
```
1. /users : <module name='elab.user' mid='user' path='users'>
2. /:uuid : {type:'WELD', name:'root', url:'/:uuid/', action:'uuidWeld'}
3. /info  : <module name='elab.keyvalue' mid='user_info' path='info'>
4. /:key  : {type:'GET', url:'/:key', action:'get'}
```
그 이후 Pipeline에서 Pipe에 등록된 Action을 순서대로 호출하게 됩니다.

```
[Module] user
[Action] uuidWeld
```
↓
```
[Module] info
[Action] get
```
↓
```
Send Response
```

위 로직에서는 user 모듈의 uuidWeld Action으로 /my/를 uuid로 인식하여 넘겨주고, /name를 key로 인식하여 user_info 모듈의 get Action으로 넘겨주게 됩니다.

각 Action은 순차적으로 실행되며 한 개의 Action의 처리가 끝나야 그 다음 Action을 처리하게 되어 있습니다.

