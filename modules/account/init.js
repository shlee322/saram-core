var nodeHash = require('node_hash/lib/hash');
var DB = require('../../system/db/index.js');

function initListModule(ctx) {
    var _this = this;

    _this.config = {};

    _this.config.name = ctx.req.body.getValue("name", _this.getMid());
    var userModule = ctx.req.body.getValue("user");
    _this.config.userModule = ctx.getSaram().modules.get(userModule);

    ctx.errorTry(!_this.config.userModule, Error);

    var columns = {};
    columns["id"] = {type:"string", length:64};
    columns["pw"] = {type:"string", length:64};

    DB.setTable(ctx, {
        name : _this.config.name,
        columns : columns,
        indexes : [{name:'id', type:'UNIQUE', columns:[["id","ASC"]]}]
    });

    DB.setQuery(ctx, {
        name : "account.signup",
        action : 'insert',
        table : _this.config.name,
        columns : {
            id : 'id',
            pw : function(ctx, args) { return nodeHash.sha256(args.pw); }
        }
    });

    DB.setQuery(ctx, {
        name : "account.getAccount",
        action : 'select',
        table : _this.config.name,
        columns : {
            uuid : 'uuid',
            id : 'id',
            pw : 'pw'
        },
        conditions : [
            { oper:'equal', column:'id', var:'id' }
        ]
    });
}

module.exports = initListModule;
