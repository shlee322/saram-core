var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');

function initListModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["name", "param", "overlap"], function() {
        _this.config = {};

        _this.config.name = ctx.req.data.getValue("name");
        _this.config.param = ctx.req.data.getValue("param", []);
        _this.config.overlap = ctx.req.data.getValue("overlap", true);

        var param = new DBParam(_this.config.param, "int64", _this.config.overlap ? "UNIQUE " : "INDEX");

        DB.setTable(ctx, {
            name : _this.config.name,
            columns : param.getColumns({
                'key' : 'int64',
                'value' : {type:"string", length:256}
            }),
            indexes : [param.getIndex("key", [["key", "ASC"]])]
        });

        DB.setQuery(ctx, {
            name : "list.list",
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
            name : "list.insert",
            action : 'insert',
            table : _this.config.name,
            columns : {
                param : param,
                key : function(ctx, args) { return XXHash.hash(new Buffer(args.value), 0x654C6162); },
                value : 'value'
            }
        });
        DB.setQuery(ctx, {
            name : "list.get",
            action : 'select',
            table : _this.config.name,
            columns : {
                uuid : 'uuid',
                value : 'value'
            },
            conditions : [
                { oper:'param', param:param },
                { oper:'equal', column:'uuid', var: 'uuid' }
            ]
        });
        DB.setQuery(ctx, {
            name : "list.update",
            action : 'update',
            table : _this.config.name,
            columns : {
                key : function(ctx, args) { return XXHash.hash(new Buffer(args.value), 0x654C6162); },
                value : 'value'
            },
            conditions : [
                { oper:'param', param:param },
                { oper:'equal', column:'uuid', var: 'uuid' }
            ]
        });
        DB.setQuery(ctx, {
            name : "list.delete",
            action : 'delete',
            table : _this.config.name,
            conditions : [
                { oper:'param', param:param },
                { oper:'equal', column:'uuid', var: 'uuid' }
            ]
        });
    });
}

module.exports = initListModule;
