/*
 POST /signup : 가입, 서버전용
 GET /signin : 로그인, 서버전용
*/

module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", action:"uuidWeld"},
    {type:"POST", url:"/signin", action:"signin"},
    {type:"GET", url:"/my_uuid", action:"my_uuid"}
];
