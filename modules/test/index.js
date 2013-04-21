var superContent = require('saram-core/module/content.js');

module.exports = {
    getName:function(){return "elab.test";},
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};

//module.exports.prototype = new superContent;