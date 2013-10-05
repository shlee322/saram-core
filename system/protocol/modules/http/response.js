var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var Response = require('../../../context/response.js');
var Header = require('../../../context/header/header.js');
var Accept = require('../../../context/header/accept.js');
var Viewer = require('../../../viewer/index.js');
var JsonViewer = require('../../../viewer/json/index.js');
var LayoutViewer = require('../../../viewer/layout/index.js');

var SERVER = "saram.elab.kr/" + require('../../../../package.json').version;
var ErrorLayout = new LayoutViewer(__dirname + '/layout/error.html', 'ejs');

function HttpResponse(ctx, res) {
    Response.apply(this, [ctx]);

    this._raw = res;
}

HttpResponse.prototype.sendResponse = function () {
    var accept = new Accept(this._ctx.req.headers.get("accept", "*/*"));
    var type = accept.find(["application/json", "text/html"]);

    var lastviewer = this._data[this._data.length - 1].viewer;
    var isJsonViewer = lastviewer == JsonViewer;
    //html인 경우 JsonHtml Layout으로 덮어씌움(Layout)
    if (type == "text/html" && isJsonViewer) {
        this.setContentType("text/html; charset=utf-8;");
        this._data.push({module:this._ctx.getSaram().getCoreModule(), viewer:ErrorLayout, data:{ content : true}});
    }
    if(type == "application/json" && !isJsonViewer) {
        this.setContentType("application/json; charset=utf-8;");
        //TODO : JsonViewer이 아닐 경우 덮어씌우기
    }

    var _this = this;

    Viewer.process(this, this._data.slice(), function(buf) {
        _this.setHeader("Server", SERVER);
        _this.setHeader("Content-Type", _this.getContentType());
        _this._raw.writeHead(_this.getStatus(), _this._headers);
        _this._raw.end(buf, 'utf8');
    });
}

HttpResponse.prototype.__proto__ = Response.prototype;
module.exports = HttpResponse;
