var moduleSys = require('../../system/module/');

module.exports = moduleSys.init({
    getName:function(){return "elab.account";},
    init:require('./init.js'),
    doc:__dirname + '/doc.xml',
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
});
