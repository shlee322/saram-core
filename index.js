//API 설계
/*
 context : 요청과 응답 사이 프로세싱 과정에 가공되는 데이터 집합
 module content : 모듈 그 자체
 module object : 모듈 오브젝트 (mid를 갖는다)
 pipeline : 요청이 왔을때 응답할 파이프의 묶음
 pipe : 개개의 처리 과정
 weld : 상위 모듈의 파이프에서 하위 모듈의 파이프로 연결
 bundle
 perm : read, write 권한 (최 상위 권한, 내부 권한이 존재할 수 있음)
 event : 모듈에서 발생한 이벤트

 bundle 구조
  welds : 다른 모듈들하고 연결됨 최우선 탐색
  get : get method pipe
  post : post method pipe

 event 기초
  기본적으로 saram-core에서 모든 모듈 액션에 관하여 "call.actionName.before", "call.actionName.after"
  이벤트를 관리한다. 이 이벤트는 액션이 실행된 전/후에 호출된다.

 server.load([module]); : 모듈 로드
 server.use([mName], [mid]); : 모듈 사용
 server.weld([mid], [path]); : 루트 pipe에 모듈 연결
 server.weld([parentMid], [childMid], [path], [weld]); : 부모모듈에 자식 모듈 연결

 server.addReceiver([targetMid], [eventName], [mid], [action]); : targetMid의 eventName의 이벤트가 호출되면 mid의 action을 호출한다.


 module_content : {
 name : "elab.users",
 info : {},
*/
var http = require('http');
var url = require('url');
var bundle = require('./module/bundle.js');
var context = require('./context.js');
var event = require('./event.js');

module.exports = function() {
    return new newSaram();
}

function newSaram() {
    this.load = saramLoadModule;
    this.use = saramUseModule;
    this.start = saramStartServer;
    this.getModuleContentByName = saramGetModuleContentByName;
    this.getModuleObjectByMid = saramGetModuleObjectByMid;
    this.weld = saramWeld;
    this.addReceiver = saramAddReceiver;

    this.call = {
        get:function(){}
    };

    this.moduleContents = {};
    this.moduleObjects = {};
    this.pipeBundle = new bundle();
    this.event = new event();

    var rootPipe = {type:"WELD", name:"root", url:"/", action:"root"};
    initPipe(this, rootPipe);
    this.pipeBundle.addPipe(rootPipe);
}

function saramLoadModule(moduleContent) {
    var name = moduleContent.getName();
    if(this.moduleContents[name]) {
        console.log("이미 로드된 모듈입니다. - " + name);
        return;
    }

    for(var i in moduleContent.pipes) {
        initPipe(this, moduleContent.pipes[i]);
    }

    this.moduleContents[name] = moduleContent;
}

function saramUseModule(moduleName, mid) {
    if(!this.moduleContents[moduleName]) {
        console.log("존재하지 않는 모듈입니다. - " + mid);
        return;
    }

    if(this.moduleObjects[mid]) {
        console.log("이미 사용중인 Mid입니다. - " + mid);
        return;
    }

    var moduleContent = this.moduleContents[moduleName];
    var moduleObject = new Object();
    moduleObject.pipeBundle = new bundle();
    moduleObject.pipeBundle.moduleContent = moduleContent;
    moduleObject.pipeBundle.moduleObject = moduleObject;
    moduleObject.event = {};
    //모듈 이름 함수
    moduleObject.getModuleName = function() {
        return moduleName;
    }
    //모듈 Id 함수
    moduleObject.getMid = function() {
        return mid;
    }

    moduleObject.obj = {getModuleName:moduleObject.getModuleName, getMid:moduleObject.getMid};

    this.moduleObjects[mid] = moduleObject;

    settingModuleBundle(this, moduleObject);
}

function saramStartServer(port) {
    console.log("Using Saram Framework - info http://saram.elab.kr");
    console.log("Port : " + port);

    var saram = this;

    var req = function(req, res) {
        httpRequest(saram, req, res);
    };

    http.createServer(req).listen(port);
}

function saramGetModuleContentByName(name) {
    var moduleContent = this.moduleContents[name];
    if(!moduleContent)
        return null;
    return moduleContent;
}

function saramGetModuleObjectByMid(mid) {
    var moduleObject = this.moduleObjects[mid];
    if(!moduleObject)
        return null;
    return moduleObject;
}

function saramWeld(parentMid, childMid, path, weld) {
    if(!parentMid || !childMid)
        return;

    if(!path) {
        weldRoutine(this, null, parentMid, childMid, null);
        return;
    }

    if(!weld) {
        weldRoutine(this, parentMid, childMid, path, null);
    } else {
        weldRoutine(this, parentMid, childMid, path, weld);
    }
}

function saramAddReceiver(targetMid, eventName, receiverMid, action) {
    var targetObject = this.getModuleObjectByMid(targetMid);
    var receiverObject = this.getModuleObjectByMid(receiverMid);

    if(!targetObject) {
        console.log(targetMid + " ModuleObject가 존재하지 않습니다.");
        return;
    }
    if(!receiverObject) {
        console.log(receiver + " ModuleObject가 존재하지 않습니다.");
    }

    var evnet = targetObject.event[eventName];
    if(!evnet) {
        event = [];
        targetObject.event[eventName] = event;
    }

    event.push({receiverObject:receiverObject, action:action});
}

function weldRoutine(saram, parentMid, childMid, path, weld) {
    if(weld instanceof String) {
        weld = [weld];
    }

    var parentObject = saram.getModuleObjectByMid(parentMid);
    var childObject = saram.getModuleObjectByMid(childMid);

    if(parentMid && !parentObject) {
        console.log(parentMid + " ModuleObject가 존재하지 않습니다.");
        return;
    }
    if(!childObject) {
        console.log(childMid + " ModuleObject가 존재하지 않습니다.");
    }

    var parentPipeBundle = null;
    if(parentObject) {
        parentPipeBundle = parentObject.pipeBundle;
    } else {
        parentPipeBundle = saram.pipeBundle;
    }
    //일단 덮어쓰자
    /*if(bundle.getWeldedBundle(weldName, pipe)) {
        console.log("이미 [1] 모듈 오브젝트 안에 [2] Weld가 존재합니다.");
        return;
    } */

    parentPipeBundle.weld(path, childObject.pipeBundle, weld);
}

function initPipe(saram, pipe) {
    if(!pipe.weld) {
        pipe.weld = ['default'];
    } else if(pipe.weld instanceof String) {
        pipe.weld = [pipe.weld];
    }

    var reg = /(?:\/:(\w+))/g;
    var r = /(?:\/+)/g;
    var path = pipe.url.replace(r, "/");

    pipe.rawPath = new Object();
    pipe.rawPath.param = [];

    while((result = reg.exec(path)) !== null) {
        pipe.rawPath.param.push(result[1]);
    }
    pipe.rawPath.path = "^" + path.replace(reg, "/(.+)");

    if(pipe.type.toLowerCase() != 'weld') {
        pipe.rawPath.path = pipe.rawPath.path + "$";
    }

    pipe.rawPath.match = function(url) {
        return url.match(this.path);
    }
}

function settingModuleBundle(saram, moduleObject) {
    var content = saram.getModuleContentByName(moduleObject.getModuleName());

    if(!(content.pipes instanceof Array)) {
        return;
    }

    var pipes = content.pipes;

    for(var i in pipes) {
        moduleObject.pipeBundle.addPipe(pipes[i]);
    }
}

function httpRequest(saram, req, res) {
    var method = req.method.toLowerCase();
    if(method != "get" && method != "post" && method != "put" && method != "delete") {
        return;
    }

    req.url = url.parse(req.url, true);
    req.query = req.url.query;
    req.path = req.url.pathname;

    var pipeline = saram.pipeBundle.getPipeline(req.method, req.path);
    //404 Error
    if(!pipeline.found) {
        res.writeHead(404);
        res.end("elab.saram.core.error.page.notfound");
        return;
    }

    var ctx = new context(saram, req, res, pipeline);
    request(saram, ctx);
}

function request(saram, ctx) {
    var nowPipe = ctx.pipeline.pipeline.shift();
    if(!nowPipe) {
        return;
    }

    if(!nowPipe.moduleObject) {
        return request(saram, ctx);
    }

    ctx.mObj = nowPipe.moduleObject.obj;
    var actionName = nowPipe.pipe.action;
    var actionFunc = nowPipe.moduleContent.actions[actionName];

    //파라미터
    ctx.req.param = {};
    for(var index in nowPipe.match) {
        var index = Number(index);
        if(!index || index == NaN || index == 0) {
            continue;
        }
        ctx.req.param[nowPipe.pipe.rawPath.param[index-1]] = nowPipe.match[index];
    }

    //다음 호출
    var step = function(){
        //"call.actionName.after"
        request(saram, ctx);
    };

    //callEvent(nowPipe.moduleObject, "call." + +".before")

    //"call.actionName.before"

    if(!actionFunc || typeof(actionFunc(ctx, step)) == "undefined") {
        step();
        return;
    }
}
/*
function callEvent(moduleObject, event, step) {
}

function callAction(func, step) {
} */