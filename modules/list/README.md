List Module
==================

## 사용방법

load : `saram-core/modules/list/`

### xml 버전

```xml
<module name='elab.list' mid='test' path='test'>
    <config>"name":"test"</config> <!--원하는 DB Table 이름 -->
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.list', 'list', { name:"test" }); //원하는 DB Table 이름
server.weld('test', 'test');
```

# Pipes(URLs)

## `GET /`

리스트를 가져옵니다.

```json
{
    "items":[
        {
            "uuid":"<UUID_HEXCODE>",
            "value":"<DATA>"
        }
    ]
}
```


## `POST /`

리스트에 <DATA>를 추가합니다.

Request Body : `value=<DATA>`


## `GET /:uuid`

해당 UUID를 가진 데이터를 가져옵니다.

```json
{ 
    "uuid":"<UUID_HEXCODE>",
    "value":"<DATA>"
}
```


## `PUT /:uuid`

해당 UUID를 가진 데이터를 수정합니다.

Request Body : `value=<DATA>`


## `DELETE /:uuid`

해당 UUID를 가진 데이터를 리스트에서 제거합니다.

