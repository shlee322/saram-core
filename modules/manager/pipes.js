module.exports = [
    {type:"GET", url:"/main", action:"main"},
    {type:"GET", url:"/modules/main", action:"modules_main"},
    {type:"GET", url:"/modules/:mid/main", action:"module_page"},
    {type:"GET", url:"/weld/main", action:"weld_main"},
    {type:"GET", url:"/weld/info/:mid", action:"get_weld_info"}

];