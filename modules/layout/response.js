var Response = require('../../system/context/response.js');

function LayoutRespone(res) {
    Response.apply(this);
    this._raw = res;
}

LayoutRespone.prototype.send = function (data, header) {
    //데이터 조작 content등.
    var layoutData = new Object();
    layoutData.content = data;

    this._raw.send(layoutData, header);
}

LayoutRespone.prototype.error = function (data, header) {
    //데이터 조작 content등.
    var layoutData = new Object();
    layoutData.content = data;

    this._raw.error(layoutData, header);
}

LayoutRespone.prototype.__proto__ = Response.prototype;
module.exports = LayoutRespone;
