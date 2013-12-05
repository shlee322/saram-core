Account Module
==================

## 사용방법

load : `saram-core/modules/account/`

### xml 버전

```xml
<module name='elab.account' mid='account' path='account'>
    <config>"name":"account", "user":"user"</config> <!--원하는 DB Table 이름, User 모듈 mid -->
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.account', 'account', { name:"account", user:"user" }); //원하는 DB Table 이름, User 모듈 mid
server.modules.weld('account', 'account');
```

필요한 모듈 : `elab.user`

# Pipes(URLs)

## `POST /signup`

아이디와 비밀번호를 사용하는 계정을 생성합니다.

Request Body : `id=<ID>&pw=<Password>`


## `POST /signin`

아이디와 비밀번호를 사용하여 로그인 합니다.

Request Body : `id=<ID>&pw=<Password>`

```json
{ 
    "access_token":"<ACCESS_TOKEN>"
}
```

