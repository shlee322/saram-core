module.exports = {
    getName:function(){return "elab.facebook";},
    init:function(ctx) {
        var saram = ctx.saram;
        var mod = ctx.current.module;
        var obj = ctx.req.body;
        mod.name = obj.name;
        mod.client_id = obj.client_id;
        mod.client_secret = obj.client_secret;
        mod.uri = obj.uri;
        mod.state = obj.state;
        mod.userPath = obj.userPath;
        if(!mod.name) {
            mod.name = mod.getMid();
        }
        if(!obj.userPath) {
            console.log("Error userPath");
        }

        initTable(saram, mod);
    },
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
};

function initTable(saram, mod) {
    var query = "CREATE  TABLE `" + mod.name + "` (`uid` BIGINT NOT NULL , `fb_id` BIGINT NULL, PRIMARY KEY (`uid`), UNIQUE INDEX `id` (`fb_id` ASC));";

    saram.db.query(null, function (db) {
        db.query(query, function(err, rows) {
            if(err) {
                console.log("ex");
            }
        });
    });
}