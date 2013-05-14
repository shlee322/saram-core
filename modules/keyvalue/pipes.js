module.exports = [
    {type:"GET", url:"/:key", action:"get"},
    {type:"POST", url:"/:key", action:"set"},
    {type:"GET", url:"/", action:"list"}
];