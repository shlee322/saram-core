module.exports = {
    getName:function(){return "elab.manager";},
    init:function(saram, mod, obj) {
        mod.moduleInfos = {};
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};