module.exports = [
    {type:"POST", url:"/add/:service", action:"add"},
    {type:"POST", url:"/send", action:"send"},
    {type:"WELD", name:"root", url:"/", action:"weld"}
];
