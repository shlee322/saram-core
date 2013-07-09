module.exports = [
    {type:"WELD", name:"root", url:"/:key/", viewer:"getWeld"},
    {type:"GET", url:"/:key", viewer:"get"},
    {type:"POST", url:"/:key", viewer:"set"},
    {type:"GET", url:"/", viewer:"list"}
];