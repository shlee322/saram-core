module.exports = [
    {type:"WELD", name:"root", url:"/", action:"testpipe"},
    {type:"GET", url:"/", action:"index"},
    {type:"POST", url:"/", action:"index_get"},
    /*{type:"GET", url:"/1234", action:"get_1234"},*/
    {type:"GET", url:"/test", action:"get_test"},
    {type:"GET", url:"/:test", action:"get_param"}
];