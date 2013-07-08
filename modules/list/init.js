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
                'hash' : 'int64',
                'value' : {type:"string", length:256}
            }),
            indexes : [param.getIndex("key", [["hash", "ASC"]])]
        });
    });
}

module.exports = initListModule;