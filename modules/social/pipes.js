module.exports = [
    {type:"GET", name:"boxlist", url:"/:uid/box/list", action:"boxlist"},
    {type:"WELD", name:"root", url:"/:uid/", action:"weld"},
    {type:"POST", name:"addFollowing", url:"/add_following", action:"addFollowing"}
]