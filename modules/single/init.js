var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');
var HashShard = require('../../system/db/partitioners/hashshard/index.js');

function initSingleModule(ctx) {
    this.config = {};

    this.config.name = ctx.req.body.getValue("name");
    this.config.param = ctx.req.body.getValue("param", []);
    this.config.columns = ctx.req.body.getValue("columns", {value:{type:"string",length:256}});

    var param = new DBParam(this.config.param, "int64", "UNIQUE");
    var hashshard = new HashShard([param]);

    var tableColumns = {};
    for(var name in this.config.columns) {
        tableColumns[name] = this.config.columns[name];
    }

    DB.setTable(ctx, {
        name : this.config.name,
        columns : param.getColumns(tableColumns),
        indexes : [param.getIndex("key", [])]
    });

    var selectQueryColumns = { uuid : 'uuid' };
    for(var name in this.config.columns) {
        selectQueryColumns[name] = name;
    }

    var insertQueryColumns = { param : param };
    for(var name in this.config.columns) {
        insertQueryColumns[name] = name;
    }

    DB.setQuery(ctx, {
        name : "single.get",
        action : 'select',
        table : this.config.name,
        partitioner:hashshard,
        columns : selectQueryColumns,
        conditions : [
            { oper:'param', param:param }
        ]
    });

    var updateQueryColumns = { };
    for(var name in this.config.columns) {
        updateQueryColumns[name] = name;
    }

    DB.setQuery(ctx, {
        name : "single.set",
        action : 'upsert',
        table : this.config.name,
        partitioner:hashshard,
        columns : insertQueryColumns,
        update : updateQueryColumns
    });

    DB.setQuery(ctx, {
        name : "single.delete",
        action : 'delete',
        table : this.config.name,
        partitioner:hashshard,
        conditions : [
            { oper:'param', param:param }
        ]
    });
}

module.exports = initSingleModule;
