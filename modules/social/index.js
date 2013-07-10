var moduleSys = require('../../system/module/');

module.exports = moduleSys.init({
    getName:function(){return "elab.social";},
    init:require('./init.js'),
    info:{},
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
});
