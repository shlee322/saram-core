/*
 /add/:service : 디바이스 추가
 /send

 {
  service : {
   gcm : {
    type : "gcm",
    key: ""
   }
  }
 */
module.exports = {
    getName:function(){return "elab.push";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        var service = obj.service;
        mod.service = {};
        for(var i in service) {
            mod.service[i] = new require('./service/'+service[i].type+".js")(i, service[i]);
        }
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};