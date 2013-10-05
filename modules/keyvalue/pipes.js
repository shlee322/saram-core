module.exports = [
    {type:"WELD", name:"root", url:"/:key/", action:"getWeld"},
    {type:"GET", url:"/:key", action:"get", doc:'get'},
    {type:"POST", url:"/:key", action:"set", doc:'set'},
    {type:"GET", url:"/", action:"list", doc:'list'}
];
