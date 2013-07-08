var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');


function initKeyValueModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["name", "param", "list"], function() {
        _this.config = {};

        _this.config.name = ctx.req.data.getValue("name");
        _this.config.param = ctx.req.data.getValue("param", []);
        _this.config.list = ctx.req.data.getValue("list", false);

        var param = new DBParam(_this.config.param, "int64", "UNIQUE");

        DB.setTable(ctx, {
            name : _this.config.name,
            columns : param.getColumns({
                'key' : 'int64',
                'str' : {type:"string", length:64},
                'value' : {type:"string", length:256}
            }),
            indexes : [param.getIndex("key", [["key", "ASC"]])]
        });

        DB.setQuery(ctx, {
            name : "keyvalue.get",
            action : 'select',
            table : _this.config.name,
            columns : {
                uuid : 'uuid',
                value : 'value'
            },
            conditions : [
                { oper:'param', param:param },
                { oper:'equal', column:'key', var: function(ctx, args) { return XXHash.hash(new Buffer(args.key), 0x654C6162); }}
            ]
        });
        DB.setQuery(ctx, {
            name : "keyvalue.list",
            action : 'select',
            table : _this.config.name,
            columns : {
                uuid : 'uuid',
                value : 'value'
            },
            conditions : [
                { oper:'param', param:param }
            ]
        });
        DB.setQuery(ctx, {
            name : "keyvalue.set",
            action : 'upsert',
            table : _this.config.name,
            columns : {
                param : param,
                key : function(ctx, args) { return XXHash.hash(new Buffer(args.key), 0x654C6162); },
                str : 'key',
                value : 'value'
            },
            update : {
                value : 'value'
            }
        });
    });
}

module.exports = initKeyValueModule;
