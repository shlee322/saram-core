/*
 POST /signup : 가입, 서버전용
 GET /signin : 로그인, 서버전용
*/

module.exports = [
    {type:"POST", url:"/signup", action:"signup"},
    {type:"POST", url:"/signin", action:"signin"},
    {type:"GET", url:"/get_uuid", action:"getUUID"}
];