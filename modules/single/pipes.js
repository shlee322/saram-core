module.exports = [
    {type:"WELD", name:"root", url:"/", action:"getWeld"},
    {type:"GET", url:"/", action:"get"},
    {type:"POST", url:"/", action:"set"}, //비공식
    {type:"PUT", url:"/", action:"set"},  //공식
    {type:"DELETE", url:"/", action:"delete"},
];
