/*
 POST /signup : 가입, 서버전용
 GET /signin : 로그인, 서버전용
*/

module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", viewer:"uuidWeld"},
    {type:"POST", url:"/signin", viewer:"signin"},
    {type:"GET", url:"/my_uuid", viewer:"my_uuid"}
];
