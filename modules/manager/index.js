module.exports = {
    getName:function(){return "elab.manager";},
    init:function(saram, mod, obj) {
        mod.moduleInfos = {};
        //saram.use('elab.static', mod.getMid()+'.')
        //saram.weld(mod.getMid(), 'elab.static', '');
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};