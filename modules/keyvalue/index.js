/*
    param은 Array로 이루어져 있으며 Array에 들어갈 값은 다음과 같다.
    ["mid", "key"]
    예. obj.param = [["user", "uuid"], ["test", "abcd"]]
 */
module.exports = {
    getName:function(){return "elab.keyvalue";},
    init:function(saram, mod, obj) {
        mod.name = obj.name;
        mod.param = obj.param;
        mod.list = obj.list;
        if(!mod.param) {
            mod.param = [];
        }
        if(!mod.list) {
            mod.list = false;
        }

        var col = "";
        for(var i in mod.param) {
            col += "`" + mod.param[i][0] + "_" + mod.param[i][1] + "` BIGINT NULL ,";
        }

        var ind = "";
        for(var i in mod.param) {
            ind += "`" + mod.param[i][0] + "_" + mod.param[i][1] + "` ASC, ";
        }

        var query = "CREATE  TABLE `" + mod.name + "` (`uid` BIGINT NOT NULL , " + col + "`key` BIGINT NOT NULL, `str` VARCHAR(64) NULL, `value`  VARCHAR(256) NULL ,PRIMARY KEY (`uid`),  UNIQUE INDEX `key` (" + ind + "`key` ASC) );";

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