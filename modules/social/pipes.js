module.exports = [
    {type:"GET", name:"boxlist", url:"/:uuid/box/list", action:"boxlist"},
    {type:"WELD", name:"root", url:"/:uuid/", action:"weld"},
    {type:"POST", name:"addFollowing", url:"/add_following", action:"addFollowing"}
]
