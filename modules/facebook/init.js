var DB = require('../../system/db/index.js');

function initFacebookModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["name", "client_id", "client_secret", "url", "state", "userPath"], function() {
        _this.config.name = ctx.req.data.getValue("name", _this.getMid());
        _this.config.client_id = ctx.req.data.getValue("client_id");
        _this.config.client_secret = ctx.req.data.getValue("client_secret");
        _this.config.url = ctx.req.data.getValue("url");
        _this.config.state = ctx.req.data.getValue("state");
        _this.config.userPath = ctx.req.data.getValue("userPath");

        ctx.errorTry(!_this.config.userPath, Error); // Error userPath

        initTable(ctx, _this);
    });
}

function initTable(ctx, module) {
    var columns = {};
    columns["fb_id"] = {type:"bigint"};

    DB.setTable(ctx, {
        name : module.config.name,
        columns : columns,
        indexes : [{name:'id', type:'UNIQUE', columns:[["fb_id","ASC"]]}]
    });
}

module.exports = initFacebookModule;