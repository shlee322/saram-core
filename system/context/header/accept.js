function Accept(str) {
    this._data = str.split(";");
}

Accept.prototype.find = function (type) {
    if(typeof(type)=="string") {
        type = [type];
    }
    var all = false;
    for(var i in this._data) {
        var data = this._data[i].split(',');
        for(var data_i in data) {
            if(data[data_i]=="*/*") {
                all = true;
                continue;
            }
            /*
            //우선 사용할 필요가 없음으로 주석
            if(data[data_i].indexOf("=") != -1)
                continue;
            */
            for(var type_i in type) {
                if(data[data_i] == type[type_i])
                    return type[type_i];
            }
        }
    }

    return /*all ? type[0] : */null;
}

module.exports = Accept;