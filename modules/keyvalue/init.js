var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');

function initKeyValueModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["name", "param", "list"], function() {
        _this.config = {};

        _this.config.name = ctx.req.data.getValue("name");
        _this.config.param = ctx.req.data.getValue("param", []);
        _this.config.list = ctx.req.data.getValue("list", false);

        var param = new DBParam(_this.config.param);
        param.addLastIndex("key");

        DB.setTable(ctx, {
            name : _this.config.name,
            param : param,
            columns : {
                'key' : 'int64',
                'str' : {type:"string", length:64},
                'value' : {type:"string", length:256}
            }
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
                { oper:'param' },
                { oper:'equal', column:'key', var:'key' }
            ]
        });
        DB.setQuery(ctx, {
            name : "keyvalue.set",
            action : 'insert',
            table : _this.config.name,
            columns : {
                uuid : 'uuid',
                value : 'value'
            }
        });
    });
}

module.exports = initKeyValueModule;