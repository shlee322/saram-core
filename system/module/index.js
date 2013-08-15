var Content = require('./content.js');
var Error = require('../error/index.js');
var Viewer = require('../viewer/index.js');
var Doc = require('../doc/index.js');

var Module = {};

Module.init = function (content) {
    if(typeof content.getName != "function" || typeof content.getName() != "string")
        throw new Error(null);
    content.__proto__ = Content.prototype;
    Content.apply(content);
    Module.initPipes(content);
    content.doc = new Doc(content.doc);
    return content;
}

Module.initPipes = function (module) {
    for(var i in module.pipes) {
        Module.initPipe(module.pipes[i]);
    }
}

/**
 * 파이프 초기화 함수
 * @param saram Saram 객체
 * @param pipe 초기화할 파이트
 */
Module.initPipe = function (pipe) {
    if(!pipe.weld) {
        pipe.weld = ['default'];
    } else if(pipe.weld instanceof String) {
        pipe.weld = [pipe.weld];
    }

    if(typeof pipe.viewer == "string")
        pipe.viewer = Viewer.Engine(pipe.viewer, "json");

    var reg = /(?:\/:(\w+))/g;
    var r = /(?:\/+)/g;
    var path = pipe.url.replace(r, "/");

    pipe.rawPath = new Object();
    pipe.rawPath.param = [];

    while((result = reg.exec(path)) !== null) {
        pipe.rawPath.param.push(result[1]);
    }

    pipe.rawPath.path = "^" + path.replace(reg, "/([^/]+)");

    if(pipe.type.toLowerCase() != 'weld') {
        pipe.rawPath.path = pipe.rawPath.path + "$";
    }

    pipe.rawPath.match = function(url) {
        return url.match(this.path);
    }
}

module.exports = Module;
