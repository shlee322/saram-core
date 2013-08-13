module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", viewer:"getWeld"},
    {type:"GET", url:"/", viewer:"list", doc:'list'},
    {type:"POST", url:"/", viewer:"insert", doc:"insert"},
    {type:"GET", url:"/:uuid", viewer:"get", doc:"get"},
    {type:"POST", url:"/:uuid", viewer:"update", doc:"update"}, //비공식
    {type:"PUT", url:"/:uuid", viewer:"update", doc:"update"},  //공식
    {type:"DELETE", url:"/:uuid", viewer:"delete", doc:"delete"}/*,
    ,
    {type:"GET", url:"/:index", action:"get"},
    {type:"POST", url:"/:index", action:"set"}*/
];                    //중복체크 기능 ㅇㅇ 추가 삭제 변경
