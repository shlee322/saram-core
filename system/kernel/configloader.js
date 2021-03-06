/**
 * 자바스크립트 코딩 없이 XML을 사용하여 Saram을 사용할 수 있도록 제공
 */
var fs = require('fs');
var path = require('path');
var libxmljs = require("libxmljs");
var moduleSys = require('../module/');

DEFAULT_MODULE = [
    'saram-core/modules/account',
    'saram-core/modules/facebook',
    'saram-core/modules/keyvalue',
    'saram-core/modules/list',
    'saram-core/modules/push',
    'saram-core/modules/simauth',
    'saram-core/modules/single',
    'saram-core/modules/social',
    'saram-core/modules/user'
];

function loadConfig(saram, file) {
    var data = "";
    try {
        data = fs.readFileSync(file, 'utf8');
    } catch (e) {
        if (e.code === 'ENOENT') {
            return;
        }
        throw e;
    }

    var xmlDoc = libxmljs.parseXml(data);

    saram._config = { receiver:[] };

    //Load Database
    var database = xmlDoc.root().find('database');
    loadNode(saram.db, database[0]);

    //Load Cache
    var cache = xmlDoc.root().find('cache');
    loadNode(saram.cache, cache[0], ['memory:///']);

    //Load Content
    var modulePath = xmlDoc.root().find('load');
    loadContent(saram.modules, modulePath);

    //Load Module
    var rootModule = xmlDoc.root().find('module');
    loadModule(saram, rootModule[0], null, path.dirname(file));

    //Load Receiver
    loadReceiver(saram, saram._config.receiver);

    //Load Protocol
    var protocols = xmlDoc.root().find('protocols');
    loadProtocols(saram.protocol, protocols[0]);

    saram._config = null;
}

function loadNode(cluster, xml, value) {
    if(!xml) {
        for(var i in value) {
            cluster.addNode(value[i]);
        }
        return;
    }


    var node = xml.find('node');
    for(var i in node) {
        cluster.addNode(node[i].text());
    }
}

function loadContent(modules, modulePath) {
    if(modulePath.length < 1)
        modulePath = DEFAULT_MODULE;

    for(var i in modulePath) {
        var contentPath = typeof(modulePath[i])=="string" ? modulePath[i] : modulePath[i].text();
        modules.load(require(contentPath));
    }
}

function loadProtocols(manager, protocols) {
    if(!protocols) {
        manager.addProtocol("http");
        return;
    }

    var protocol = protocols.find('protocol');
    for(var i in protocol) {
        manager.addProtocol(protocol[i].attr('type').value(), getModuleConfig(protocol[i]));
    }
}

function loadModule(saram, moduleXml, parent, cwd) {
    var moduleFile = moduleXml.attr('file');
    if(moduleFile) {
        var filepath = path.resolve(cwd, moduleFile.value());
        return loadModule(saram, libxmljs.parseXml(fs.readFileSync(filepath, 'utf8')).root(), parent, path.dirname(filepath));
    }

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

            var init = moduleXml.find('init');
            if(init[0]) {
                content.init = loadFunction(init[0], cwd);
            }

            saram.modules.load(content);
        }
        saram.modules.use(moduleName, mid, getModuleConfig(moduleXml));
        module = saram.modules.get(mid);

        //부모 모듈이 있으면 연결
        var weldPath = moduleXml.attr('path');
        if(parent && weldPath) {
            saram.modules.weld(parent.getMid(), module.getMid(), weldPath.value());
        }
    }

    //Action 추가
    var actions = moduleXml.find('action');
    for(var i in actions) {
        var action = actions[i];
        module.addAction(action.attr('name').value(), loadFunction(action, cwd));
    }

    //Pipe 추가
    var pipes = moduleXml.find('pipe');
    for(var i in pipes) {
        var pipe = pipes[i];
        var doc = pipe.attr('doc') ? pipe.attr('doc').value() : null;
        module.addPipe({type:pipe.attr('type').value(), url:pipe.attr('url').value(), action:pipe.attr('action').value(), doc : doc});
    }

    var receiver = moduleXml.find('receiver');
    for(var i in receiver) {
        saram._config.receiver.push(receiver[i]);
    }

    //문서 추가
    var doc = moduleXml.find('doc');
    if(doc.length > 0) {
        var docObj = doc[0];
        if(docObj.attr('file')) {
            docObj = libxmljs.parseXml(fs.readFileSync(docObj.attr('file').value(), 'utf8')).root();
        }
        module.doc.addDoc(docObj);
    }


    //자식 로드
    var child = moduleXml.find('module');
    for(var i in child) {
        loadModule(saram, child[i], module, cwd);
    }
}

function getModuleConfig(moduleXml) {
    var config = moduleXml.find('config');
    if(!config[0])
        return {};
    return JSON.parse("{" + config[0].text() + "}");
}

function loadReceiver(saram, receiverList) {
    for(var i in receiverList) {
        var receiver = receiverList[i];
        var mid = receiver.parent().attr('mid');
        mid = mid ? mid.value() : null;
        saram.modules.addReceiver(mid, receiver.attr('event').value(), receiver.attr('receiver').value(), receiver.attr('action').value());
    }
}

function loadFunction(xml, cwd) {
    var script = xml.text();
    var file = xml.attr('file');

    var func = function (ctx) {};

    if(file) {
        var filepath = path.resolve(cwd, file.value());
        func = require(filepath);
    } else {
        func = function(ctx) { eval(script); };
    }

    return func;
}

module.exports = loadConfig;
