module.exports = {
    getName:function(){return "elab.test";},
    load:function(saram, content) {
        console.log("test load");
    },
    init:function(saram, mObj, obj) {
        console.log("test init");
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js'),
    templates:require('./templates.js')
};