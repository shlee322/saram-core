/**
 *
 * @param arr [["mid","param"]]
 * @constructor
 */
function DBParam(arr) {
    this._param = arr;
    this._lastIndex = [];
    this.indexName = 'key';
    this.indexType = 'UNIQUE';
}

DBParam.prototype.addLastIndex = function (index) {
    this._lastIndex.push(index);
}

DBParam.prototype.toColumns = function (columns, type) {
    for(var i in this._param) {
        columns[this._param[i][0] + "_" + this._param[i][1]] = type;
    }
}

DBParam.prototype.toIndexColumns = function (indexColumns, type) {
    if(!type) {
        type = "ASC";
    }
    for(var i in this._param) {
        indexColumns.push([this._param[i][0] + "_" + this._param[i][1], type]);
    }
    for(var i in this._lastIndex) {
        indexColumns.push(this._lastIndex[i]);
    }
}

DBParam.prototype.getIndex = function () {
    var index=[];
    this.toIndexColumns(index);
    if(index.length < 1)
        return null;
    return {name:this.indexName, type:this.indexType, columns:index};
}

module.exports = DBParam;