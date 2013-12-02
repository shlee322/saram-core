var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var DBParam = require('../../system/db/param.js');
var HashShard = require('../../system/db/partitioners/hashshard/index.js');

function initListModule(ctx) {
    this.config = {};

    this.config.name = ctx.req.body.getValue("name");
    this.config.param = ctx.req.body.getValue("param", []);
    this.config.overlap = ctx.req.body.getValue("overlap", true);
    this.config.columns = ctx.req.body.getValue("columns", {value:{type:"string",length:256}});

    var param = new DBParam(this.config.param, "int64", this.config.overlap ? "UNIQUE" : "INDEX");
    var hashshard = new HashShard([param]);

    var tableColumns = { 'key':'int64' };
    for(var name in this.config.columns) {
        tableColumns[name] = this.config.columns[name];
    }

    DB.setTable(ctx, {
        name : this.config.name,
        columns : param.getColumns(tableColumns),
        indexes : [param.getIndex("key", [["key", "ASC"]])]
    });

    var selectQueryColumns = { uuid : 'uuid' };
    for(var name in this.config.columns) {
        selectQueryColumns[name] = name;
    }

    DB.setQuery(ctx, {
        name : "list.list",
        action : 'select',
        table : this.config.name,
        partitioner:hashshard,
        columns : selectQueryColumns,
        conditions : [
            { oper:'param', param:param }
        ]
    });

    var _this = this;
    var keyFunction = function(ctx, args) {
        var key = "";
        for(var name in _this.config.columns) {
            key = key + name + "(" + args[name] + ")";
        }
        return XXHash.hash(new Buffer(key), 0x654C6162);
    }

    var insertQueryColumns = { param : param, key: keyFunction };
    for(var name in this.config.columns) {
        insertQueryColumns[name] = name;
    }

    DB.setQuery(ctx, {
        name : "list.insert",
        action : 'insert',
        table : this.config.name,
        partitioner:hashshard,
        columns : insertQueryColumns
    });

    DB.setQuery(ctx, {
        name : "list.get",
        action : 'select',
        table : this.config.name,
        partitioner:hashshard,
        columns : selectQueryColumns,
        conditions : [
            { oper:'param', param:param },
            { oper:'equal', column:'uuid', var: 'uuid' }
        ]
    });

    var updateQueryColumns = { key: keyFunction };
    for(var name in this.config.columns) {
        updateQueryColumns[name] = name;
    }

    DB.setQuery(ctx, {
        name : "list.update",
        action : 'update',
        table : this.config.name,
        partitioner:hashshard,
        columns : updateQueryColumns,
        conditions : [
            { oper:'param', param:param },
            { oper:'equal', column:'uuid', var: 'uuid' }
        ]
    });

    DB.setQuery(ctx, {
        name : "list.delete",
        action : 'delete',
        table : this.config.name,
        partitioner:hashshard,
        conditions : [
            { oper:'param', param:param },
            { oper:'equal', column:'uuid', var: 'uuid' }
        ]
    });
}

module.exports = initListModule;
