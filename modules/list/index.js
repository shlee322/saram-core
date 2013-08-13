var moduleSys = require('saram-core/system/module/');

module.exports = moduleSys.init({
    getName:function(){return "elab.list";},
    init:require('./init.js'),
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    manager:require('./manager.js')
});
