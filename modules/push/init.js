function initPushModule(ctx) {
    var _this = this;
    var saram = ctx.getSaram();
    var mid = ctx.current.module.getMid();

    ctx.req.data.readKey(["service", "param"], function() {
        _this._service = {};

        var service = ctx.req.data.getValue("service");
        var param = ctx.req.data.getValue("param");

        for(var i in service) {
            var moduleName = ctx.current.module.getMid()+'.'+i;
            saram.modules.use('elab.list', mid+'.'+i, {
                name:mid+"_"+i,
                param : param,
                overlap:false
            });
            saram.weld(mid, moduleName, i);
            saram.addReceiver(moduleName, 'call.get.before', null, 'serverOnly');
            saram.addReceiver(moduleName, 'call.insert.before', null, 'serverOnly');
            saram.addReceiver(moduleName, 'call.update.before', null, 'serverOnly');
            saram.addReceiver(moduleName, 'call.delete.before', null, 'serverOnly');

            var ser = require('./service/'+service[i].type+".js");
            _this._service[i] = new ser(ctx, i, service[i]);
        }

    });
}

module.exports = initPushModule;
