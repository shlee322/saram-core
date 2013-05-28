/*
    param은 Array로 이루어져 있으며 Array에 들어갈 값은 다음과 같다.
    ["mid", "key"]
    예. obj.param = [["user", "uuid"], ["test", "abcd"]]
 */
module.exports = {
    getName:function(){return "elab.keyvalue";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        mod.name = obj.name;
        mod.param = obj.param;
        mod.list = obj.list;
        if(!mod.param) {
            mod.param = [];
        }
        if(!mod.list) {
            mod.list = false;
        }

        var columns = {};
        saram.db.utill.paramToColumns(columns, mod.param, "int64");
        columns["key"] = "int64";
        columns["str"] = {type:"string", length:64};
        columns["value"] = {type:"string", length:256};
        var index = [];
        saram.db.utill.paramToIndexColumns(index, mod.param);
        index.push("key");

        saram.db.setTable(ctx, {
            name : obj.name,
            shardKey : function(nodeLength, Args) {
                return 0;
            },
            columns : columns,
            indexes : [{name:'key', type:'UNIQUE', columns:index}]
        });

        mod.name = obj.name;
        mod.param = obj.param;
        mod.list = obj.list;
        if(!mod.param) {
            mod.param = [];
        }
        if(!mod.list) {
            mod.list = false;
        }
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};