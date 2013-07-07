var DB = require('../../system/db/index.js');

function initListModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["name", "param", "list"], function() {
        _this.config = {};

        _this.config.name = ctx.req.data.getValue("name", _this.getMid());
        _this.config.userPath = ctx.req.data.getValue("userPath");

        ctx.errorTry(_this.config.userPath, Error);

        initTable(ctx, _this);
    });
}

function initTable(ctx, module) {
    var columns = {};
    columns["id"] = {type:"string", length:64};
    columns["pw"] = {type:"string", length:64};

    DB.setTable(ctx, {
        name : module.config.name,
        columns : columns,
        indexes : [{name:'id', type:'UNIQUE', columns:[["id","ASC"]]}]
    });
}

module.exports = initListModule;