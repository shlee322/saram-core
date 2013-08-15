var fs = require('fs');
var libxmljs = require("libxmljs");

function Doc(doc) {
    this._apis = {};

    if(doc instanceof Doc) {
        this.parent = doc;
    } else { // String
        this.addDoc(doc);
    }
}

//Doc 확장
Doc.prototype.addDoc = function (file) {
    var data = "";
    try {
        data = fs.readFileSync(file);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return;
        }
        throw e;
    }
    var xmlDoc = libxmljs.parseXml(data);

    var apis = xmlDoc.root().find('api');
    for(var i in apis)
        this.loadApi(apis[i]);
}

Doc.prototype.loadApi = function(api) {
    var doc = {};

    var id = api.attr('id').value();
    doc.name = api.find('name')[0].text();
    doc.info = api.find('info')[0].text();
    doc.request = {};
    doc.response = {};

    var request = api.find('request');
    if(request.length > 0) {
        doc.request.Parameter = loadRequest(request[0], 'param');
        doc.request.Query = loadRequest(request[0], 'query');
        doc.request.Data = loadRequest(request[0], 'data');
    }

    var response = api.find('response');
    for(var i in response) {
        var res = loadResponse(response[i]);
        doc.response[res.name] = res;
    }


    this._apis[id] = doc;
}

function loadRequest(xml, type) {
    var data = xml.find(type);
    if(data.length < 1)
        return null;

    var req = [];
    for(var i in data) {
        req.push({name:data[i].attr('name').value(), value:data[i].text()});
    }
    return req;
}

function loadResponse(response) {
    var res = {};
    res.name = response.attr('name').value();
    res.json = "";
    var json = response.find('json');
    if(json.length > 0) {
        res.json = json[0].text();
    }
    return res;
}

Doc.prototype.getApi = function (api) {
    if(this._apis[api])
        return this._apis[api];

    return this.parent ? this.parent.getApi(api) : null;
}

module.exports = Doc;