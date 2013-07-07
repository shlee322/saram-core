exports.paramToColumns = function (columns, param, type) {
    for(var i in param) {
        columns[param[i][0] + "_" + param[i][1]] = type;
    }
}

exports.paramToIndexColumns = function (indexColumns, param, type) {
    if(!type) {
        type = "ASC";
    }
    for(var i in param) {
        indexColumns.push([param[i][0] + "_" + param[i][1], type]);
    }
}