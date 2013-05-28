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

        var col = "";
        for(var i in mod.param) {
            col += "`" + mod.param[i][0] + "_" + mod.param[i][1] + "` BIGINT NULL ,";
        }

        var ind = "";
        for(var i in mod.param) {
            ind += "`" + mod.param[i][0] + "_" + mod.param[i][1] + "` ASC, ";
        }

        var query = "CREATE  TABLE `" + mod.name + "` (`uid` BIGINT NOT NULL , " + col + "`value`  VARCHAR(256) NULL ,PRIMARY KEY (`uid`)";
        if(mod.param.length > 0 ) {
            query += ", " + (!mod.overlap ? "UNIQUE " : "") + "INDEX `key` (" + ind + ")";
        }
        query += ");";

        saram.db.query(null, function (db) {
            db.query(query, function(err, rows) {
                if(err) {
                    console.log("ex");
                }
            });
        });
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};