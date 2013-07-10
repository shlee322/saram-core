module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", viewer:"getWeld"},
    {type:"GET", url:"/", viewer:"list"},
    {type:"POST", url:"/", viewer:"insert"},
    {type:"GET", url:"/:uuid", viewer:"get"},
    {type:"POST", url:"/:uuid", viewer:"update"}, //비공식
    {type:"PUT", url:"/:uuid", viewer:"update"},  //공식
    {type:"DELETE", url:"/:uuid", viewer:"delete"}/*,
    ,
    {type:"GET", url:"/:index", action:"get"},
    {type:"POST", url:"/:index", action:"set"}*/
];                    //중복체크 기능 ㅇㅇ 추가 삭제 변경
