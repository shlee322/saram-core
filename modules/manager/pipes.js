module.exports = [
    {type:"GET", url:"/main", action:"main"},
    {type:"GET", url:"/modules/main", action:"modules_main"},
    {type:"POST", url:"/modules/create", action:"modules_module_create"},
    {type:"GET", url:"/modules/create/info", action:"modules_module_create_info"},
    {type:"GET", url:"/modules/info/:mid/main", action:"modules_module_page"},
    {type:"GET", url:"/weld/main", action:"weld_main"},
    {type:"GET", url:"/weld/info/:mid", action:"get_weld_info"}
];