/**
 *
 * @param arr [["mid","param"]]
 * @constructor
 */
function DBParam(arr, columnType, indexType) {
    this._param = arr;
    this.columnType = columnType ? columnType : "int64";
    this.indexType = indexType ? indexType : "INDEX";
}

DBParam.prototype.getColumns = function (columns) {
    columns = columns ? columns : {};

    var newColumns = {};
    for(var i in this._param) {
        newColumns[this._param[i][0] + "_" + this._param[i][1]] = this.columnType;
    }

    for(var name in columns)
        newColumns[name] = columns[name];

    return newColumns;
}

DBParam.prototype.getIndex = function (name, lastIndex) {
    if(!name)
        name = "key";

    lastIndex = lastIndex ? lastIndex : [];

    var paramIndex = [];

    for(var i in this._param)
        paramIndex.push([this._param[i][0] + "_" + this._param[i][1], "ASC"]);
    for(var i in lastIndex)
        paramIndex.push(lastIndex[i]);

    if(paramIndex.length < 1)
        return null;

    return {name:name, type:this.indexType, columns:paramIndex};
}



module.exports = DBParam;