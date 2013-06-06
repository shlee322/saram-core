module.exports = [
    {type:"WELD", name:"root", url:"/:uid/", action:"getWeld"},
    {type:"GET", url:"/", action:"list"},
    {type:"POST", url:"/", action:"insert"},
    {type:"GET", url:"/:uid", action:"get"},
    {type:"POST", url:"/:uid", action:"update"}, //비공식
    {type:"PUT", url:"/:uid", action:"update"},  //공식
    {type:"DELETE", url:"/:uid", action:"delete"},
    /*,
    {type:"GET", url:"/:index", action:"get"},
    {type:"POST", url:"/:index", action:"set"}*/
];                    //중복체크 기능 ㅇㅇ 추가 삭제 변경