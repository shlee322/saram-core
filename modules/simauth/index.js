var moduleSys = require('../../system/module/');

module.exports = moduleSys.init({
    getName:function(){return "elab.simauth";},
    init:require('./init.js'),
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
});
