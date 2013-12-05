module.exports = [
    {type:"WELD", name:"root", url:"/:key/", action:"getWeld"},
    {type:"GET", url:"/:key", action:"get"},
    {type:"POST", url:"/:key", action:"set"},
    {type:"GET", url:"/", action:"list"}
];
