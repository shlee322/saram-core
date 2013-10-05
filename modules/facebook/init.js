var DB = require('../../system/db/index.js');

function initFacebookModule(ctx) {
    var _this = this;

    _this.config = {};
    _this.config.name = ctx.req.body.getValue("name", _this.getMid());
    _this.config.client_id = ctx.req.body.getValue("client_id");
    _this.config.client_secret = ctx.req.body.getValue("client_secret");
    _this.config.url = ctx.req.body.getValue("url");
    _this.config.state = ctx.req.body.getValue("state");

    var userModule = ctx.req.body.getValue("user");
    _this.config.userModule = ctx.getSaram().modules.get(userModule);

    ctx.errorTry(!_this.config.userModule, Error); // Error userPath

    var columns = {};
    columns["fb_id"] = {type:"int64"};

    DB.setTable(ctx, {
        name : _this.config.name,
        columns : columns,
        indexes : [{name:'id', type:'UNIQUE', columns:[["fb_id","ASC"]]}]
    });

    DB.setQuery(ctx, {
        name : "facebook.getUUID",
        action : 'select',
        table : _this.config.name,
        columns : {
            uuid : 'uuid'
        },
        conditions : [
            { oper:'equal', column:'fb_id', var:'fb_id' }
        ]
    });

    DB.setQuery(ctx, {
        name : "facebook.register",
        action : 'insert',
        table : _this.config.name,
        columns : {
            fb_id : "fb_id"
        }
    });
}

module.exports = initFacebookModule;
