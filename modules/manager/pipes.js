var Viewer = require('../../system/viewer/index.js');

module.exports = [
    {type:"GET", url:"/", viewer:Viewer.Template("main", "main.html")},
    {type:"GET", url:"/apis", viewer:Viewer.Template("apis", "apis.html")}
];