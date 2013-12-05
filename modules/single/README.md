Single Module
==================

## 사용방법

load : `saram-core/modules/single/`

### xml 버전

```xml
<module name='elab.single' mid='test' path='test'>
    <config>"name":"test"</config> <!--원하는 DB Table 이름 -->
</module>
```

### javascript 버전

```javascript
server.modules.use('elab.single', 'test', { name:"test" }); //원하는 DB Table 이름
server.modules.weld('test', 'test');
```

# Pipes(URLs)

## `GET /`

데이터를 가져옵니다.

```json
{ 
    "uuid":"<UUID_HEXCODE>",
    "value":"<DATA>"
}
```


## `PUT /`

데이터를 수정합니다.

Request Body : `value=<DATA>`


## `DELETE /`

데이터를 제거합니다.

