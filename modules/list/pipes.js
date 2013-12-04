module.exports = [
    {type:"WELD", name:"root", url:"/:uuid/", action:"getWeld"},
    {type:"GET", url:"/", action:"list", doc:'list'},
    {type:"POST", url:"/", action:"insert", doc:"insert"},
    {type:"GET", url:"/:uuid", action:"get", doc:"get"},
    {type:"POST", url:"/:uuid", action:"update", doc:"update"}, //비공식
    {type:"PUT", url:"/:uuid", action:"update", doc:"update"},  //공식
    {type:"DELETE", url:"/:uuid", action:"delete", doc:"delete"}
];
