User Module
==================

## 사용방법

load : `saram-core/modules/user/`

### xml 버전

```xml
<module name='elab.user' mid='user' path='users'>
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.user', 'user');
server.modules.weld('user', 'users');
```

필요한 모듈 : `elab.user`

# Pipes(URLs)

## `POST /signin`

UUID를 이용하여 로그인합니다.
`서버 전용`

Request Body : `uuid=<USER_UUID>`


## `GET /my_uuid`

로그인한 사용자의 UUID를 확인합니다.

```json
{ 
    "uuid":"<USER_UUID>"
}
```

