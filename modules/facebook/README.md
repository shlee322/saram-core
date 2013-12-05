Facebook Module
==================

## 사용방법

load : `saram-core/modules/facebook/`

### xml 버전

```xml
<module name='elab.facebook' mid='facebook' path='facebook'>
    <config>
        "client_id":"<FACEBOOK_APP_ID>",
        "client_secret":"<FACEBOOK_APP_SECRET>",
        "url":"http://<HOST>/facebook",
        "state":"",
        "user":"user"
    </config>
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.facebook', 'facebook', {
    client_id:"<FACEBOOK_APP_ID>",
    client_secret:"<FACEBOOK_APP_SECRET>",
    url:"http://<HOST>/facebook",
    state:"",
    user:"user"
});
server.modules.weld('facebook', 'facebook');
```

필요한 모듈 : `elab.user`

# Pipes(URLs)

## `GET /auth`

페이스북 인증 화면으로 이동합니다.
사용자가 페이스북 인증 절차를 끝내면 `GET /auth?fb_token=<FACEBOOK_TOKEN>`와 동일한 방식으로 처리됩니다.


## `GET /auth?fb_token=<FACEBOOK_TOKEN>`

페이스북 엑세스 토큰을 사용하여 로그인합니다.

```json
{ 
    "access_token":"<ACCESS_TOKEN>"
}
```

