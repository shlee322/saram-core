module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", action:"getWeld"},
    {type:"GET", url:"/", action:"list", doc:'list'},
    {type:"POST", url:"/", action:"insert", doc:"insert"},
    {type:"GET", url:"/:uuid", action:"get", doc:"get"},
    {type:"POST", url:"/:uuid", action:"update", doc:"update"}, //비공식
    {type:"PUT", url:"/:uuid", action:"update", doc:"update"},  //공식
    {type:"DELETE", url:"/:uuid", action:"delete", doc:"delete"}/*,
    ,
    {type:"GET", url:"/:index", action:"get"},
    {type:"POST", url:"/:index", action:"set"}*/
];                    //중복체크 기능 ㅇㅇ 추가 삭제 변경
