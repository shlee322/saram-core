/*
 POST /signup : 가입, 서버전용
 POST /signin : 로그인, 서버전용
*/

module.exports = [
    {type:"POST", url:"/signup", action:"signup", doc:'signup'},
    {type:"POST", url:"/signin", action:"signin", doc:'signin'},
    {type:"GET", url:"/get_uuid", action:"getUUID"}
];
