module.exports = [
    {type:"GET", name:"boxlist", url:"/:uuid/box/list", viewer:"boxlist"},
    {type:"WELD", name:"root", url:"/:uuid/", viewer:"weld"},
    {type:"POST", name:"addFollowing", url:"/add_following", viewer:"addFollowing"}
]
