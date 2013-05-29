module.exports = {
    getName:function(){return "elab.list";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        mod.name = obj.name;
        mod.param = obj.param;
        mod.overlap = obj.overlap;

        if(!mod.param) {
            mod.param = [];
        }
        if(!mod.overlap) {
            mod.overlap = true;
        }

        var columns = {};
        saram.db.utill.paramToColumns(columns, mod.param, "int64");
        columns["hash"] = {type:"int64"};
        columns["value"] = {type:"string", length:256};
        var index = [];
        saram.db.utill.paramToIndexColumns(index, mod.param);
        index.push("hash");

        saram.db.setTable(ctx, {
            name : obj.name,
            shardKey : function(nodeLength, Args) {
                return 0;
            },
            columns : columns,
            indexes : [{name:'key', type:mod.overlap ? "UNIQUE " : "INDEX", columns:index}]
        });
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};