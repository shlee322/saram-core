/**
 * 자바스크립트 코딩 없이 XML을 사용하여 Saram을 사용할 수 있도록 제공
 */
var fs = require('fs');
var libxmljs = require("libxmljs");
var moduleSys = require('../module/');

function loadConfig(saram, file) {
    var xmlDoc = libxmljs.parseXml(fs.readFileSync(file));

    //Load Database
    var database = xmlDoc.root().find('database');
    loadNode(saram.db, database[0]);

    //Load Cache
    var cache = xmlDoc.root().find('cache');
    loadNode(saram.cache, cache[0]);

    //Load Content
    var modulePath = xmlDoc.root().find('load');
    loadContent(saram.modules, modulePath);

    //Load Module
    var rootModule = xmlDoc.root().find('module');
    loadModule(saram, rootModule[0]);

    //Load Protocol
    var protocols = xmlDoc.root().find('protocols');
    loadProtocols(saram.protocol, protocols[0]);
}

function loadNode(cluster, xml) {
    if(!xml)
        return;

    var node = xml.find('node');
    for(var i in node) {
        cluster.addNode(node[i].text());
    }
}

function loadContent(modules, modulePath) {
    for(var i in modulePath) {
        modules.load(require(modulePath[i].text()));
    }
}

function loadProtocols(manager, protocols) {
    if(!protocols)
        return;

    var protocol = protocols.find('protocol');
    for(var i in protocol) {
        manager.addProtocol(protocol[i].attr('type').value());
    }
}

function loadModule(saram, moduleXml, parent) {
    var module = null;

    var moduleName = moduleXml.attr('name');
    moduleName = moduleName ? moduleName.value() : null;

    if(!moduleName && !parent) { // Root Module
        module = saram.getCoreModule();
    } else {
        var mid = moduleXml.attr('mid').value();
        if(!moduleName) { // Custom Module
            moduleName = mid;

            var content = moduleSys.init({
                getName:function(){return mid;},
                init:function(ctx){},
                info:{},
                actions:{},
                pipes:[]
            });
            saram.modules.load(content);
        }
        //TODO: action 등등 설정

        saram.modules.use(moduleName, mid, getModuleConfig(moduleXml));
        module = saram.modules.get(mid);

        //부모 모듈이 있으면 연결
        var path = moduleXml.attr('path');
        if(parent && path) {
            saram.modules.weld(parent.getMid(), module.getMid(), path.value());
        }
    }

    var child = moduleXml.find('module');
    for(var i in child) {
        loadModule(saram, child[i], module);
    }
}

function getModuleConfig(moduleXml) {
    var config = moduleXml.find('config');
    if(!config[0])
        return {};
    return JSON.parse("{" + config[0].text() + "}");
}

module.exports = loadConfig;