module.exports = function(ctx) {
    var saram = ctx.saram;
    var mod = ctx.current.module;
    var obj = ctx.req.body;
    if(!obj) {
        obj = {};
    }
    mod.name = obj.name;
    mod.userPath = obj.userPath;
    if(!mod.name) {
        mod.name = mod.getMid();
    }
    if(!obj.userPath) {
        console.log("Error userPath");
    }

    initTable(saram, mod);
}

function initTable(saram, mod) {
    var query = "CREATE  TABLE `" + mod.name + "` (`uid` BIGINT NOT NULL , `id` VARCHAR(64) NULL, `pw` VARCHAR(64) NULL, PRIMARY KEY (`uid`), UNIQUE INDEX `id` (`id` ASC));";

    saram.db.query(null, function (db) {
        db.query(query, function(err, rows) {
            if(err) {
                console.log("ex");
            }
        });
    });
}