module.exports = [
    {type:"POST", url:"/add/:service", viewer:"add"},
    {type:"POST", url:"/send", viewer:"send"},
    {type:"WELD", name:"root", url:"/", viewer:"weld"}
];
