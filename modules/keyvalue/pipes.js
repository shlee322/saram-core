module.exports = [
    {type:"WELD", name:"root", url:"/:key/", viewer:"getWeld"},
    {type:"GET", url:"/:key", viewer:"get", doc:'get'},
    {type:"POST", url:"/:key", viewer:"set", doc:'set'},
    {type:"GET", url:"/", viewer:"list", doc:'list'}
];
