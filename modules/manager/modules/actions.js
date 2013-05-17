var path = require('path');
var fs = require('fs');

module.exports = function(obj) {
    obj.modules_main = modules_main;
    obj.modules_module_page = modules_module_page;
    obj.modules_module_create = modules_module_create;
    obj.modules_module_create_info = modules_module_create_info;
};

function modules_main(ctx, next) {
    var obj = {};
    obj.moduleInfos = [];
    obj.midList = [];

    var info = ctx.current.module.moduleInfos;
    for(var name in info) {
        var mod = {};
        mod.name = name;
        mod.path = path.resolve(__dirname, info[name].path);
        mod.info = info[name].info.info;
        if(!mod.info) {
            mod.info = {name:"", description:""};
        }
        obj.moduleInfos.push(mod);
    }

    for(var mid in ctx.saram.moduleObjects) {
        obj.midList.push(mid);
    }

    ctx.res.send(obj);
}

function modules_module_page(ctx, next) {
    var mod = ctx.saram.getModuleObjectByMid(ctx.req.param.mid);
    ctx.res.send({});
}

function modules_module_create_info(ctx, next) {
    ctx.res.send({license:"http://www.gnu.org/licenses/lgpl-2.1.txt"});
}

function modules_module_create(ctx, next) {
    ctx.res.send({});
}
