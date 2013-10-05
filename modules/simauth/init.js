var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');

function initSimAuthModule(ctx) {
    var _this = this;

    _this.config = {};
    _this.config.name = ctx.req.body.getValue("name", _this.getMid());

    var userModule = ctx.req.body.getValue("user");
    _this.config.userModule = ctx.getSaram().modules.get(userModule);

    ctx.errorTry(!_this.config.userModule, Error); // Error userPath

    var columns = {};
    columns["key"] = {type:"int64"};
    columns["str"] = {type:"string", length:256};

    DB.setTable(ctx, {
        name : _this.config.name,
        columns : columns,
        indexes : [{name:'key', type:'UNIQUE', columns:[["key","ASC"]]}]
    });

    DB.setQuery(ctx, {
        name : "simauth.getAccount",
        action : 'select',
        table : _this.config.name,
        columns : {
            uuid : 'uuid'
        },
        conditions : [
            { oper:'equal', column:'key', var: function(ctx, args) { return XXHash.hash(new Buffer(args.key), 0x654C6162); }}
        ]
    });

    DB.setQuery(ctx, {
        name : "simauth.register",
        action : 'insert',
        table : _this.config.name,
        columns : {
            key : function(ctx, args) { return XXHash.hash(new Buffer(args.key), 0x654C6162); },
            str : 'key'
        }
    });
}

module.exports = initSimAuthModule;
