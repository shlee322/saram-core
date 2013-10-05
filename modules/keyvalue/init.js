var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');
var HashShard = require('../../system/db/partitioners/hashshard/index.js');


function initKeyValueModule(ctx) {
    var _this = this;

    _this.config = {};

    _this.config.name = ctx.req.body.getValue("name");
    _this.config.param = ctx.req.body.getValue("param", []);
    _this.config.list = ctx.req.body.getValue("list", false);

    var param = new DBParam(_this.config.param, "int64", "UNIQUE");

    var shardingItems = [param];
    if(!_this.config.list) {
        shardingItems.push(function(ctx, args) { return XXHash.hash(new Buffer(args.key), 0x654C6162); });
    }

    var hashshard = new HashShard(shardingItems);

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
        partitioner:hashshard,
        columns : {
            uuid : 'uuid',
            str : 'key',
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
        partitioner:hashshard,
        columns : {
            uuid : 'uuid',
            str : 'key',
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
        partitioner:hashshard,
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
}

module.exports = initKeyValueModule;
