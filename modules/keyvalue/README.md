KeyValue Module
==================

## 사용방법

load : `saram-core/modules/keyvalue/`

### xml 버전

```xml
<module name='elab.keyvalue' mid='test' path='test'>
    <config>"name":"test"</config> <!--원하는 DB Table 이름 -->
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.keyvalue', 'test', { name:"test" }); //원하는 DB Table 이름
server.modules.weld('test', 'test');
```

# Pipes(URLs)

## `GET /:key`

해당 Key를 가진 데이터를 가져옵니다.

```json
{ 
    "uuid":"<UUID_HEXCODE>",
    "key":"<KEY>",
    "value":"<DATA>"
}
```


## `POST /:key`

데이터를 해당 Key에 삽입합니다.

Request Body : `value=<DATA>`


## `GET /`

리스트를 가져옵니다.

단, `list:true`일 때에만 사용 가능합니다.

```json
{
    "items":[
        {
            "uuid":"<UUID_HEXCODE>",
            "key":"<KEY>",
            "value":"<DATA>"
        }
    ]
}
```


