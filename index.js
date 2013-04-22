/**
 * @namespace: Saram Core (http://saram.elab.kr)
 * @author: Lee Sanghyuck(http://profile.elab.kr)
 * @version: 0.1
 * @since: 2013.04.20
 * @description: Saram의 중심체 입니다.
 *
 * 용어 설명, 기본 API
 *
 * context : 요청과 응답 사이 프로세싱 과정에 가공되는 데이터 집합
 * module content : 모듈 그 자체
 * module object : 모듈 오브젝트 (mid를 갖는다)
 * pipeline : 요청이 왔을때 응답할 파이프의 묶음
 * pipe : 개개의 처리 과정
 * weld : 상위 모듈의 파이프에서 하위 모듈의 파이프로 연결
 * bundle
 * perm : read, write 권한 (최 상위 권한, 내부 권한이 존재할 수 있음)
 * event : 모듈에서 발생한 이벤트
 *
 * bundle 구조
 * welds : 다른 모듈들하고 연결됨 최우선 탐색
 * get : get method pipe
 * post : post method pipe
 *
 * event 기초
 * 기본적으로 saram-core에서 모든 모듈 액션에 관하여 "call.actionName.before", "call.actionName.after"
 * 이벤트를 관리한다. 이 이벤트는 액션이 실행된 전/후에 호출된다.
 *
 * saram.load([module]); : 모듈 로드
 * saram.use([mName], [mid]); : 모듈 사용
 * saram.weld([mid], [path]); : 루트 pipe에 모듈 연결
 * saram.weld([parentMid], [childMid], [path], [weld]); : 부모모듈에 자식 모듈 연결
 *
 * saram.addReceiver([targetMid], [eventName], [mid], [action]); : targetMid의 eventName의 이벤트가 호출되면 mid의 action을 호출한다.
 */

var http = require('http');
var url = require('url');
var bundle = require('./module/bundle.js');
var context = require('./context.js');

/**
 * 새로운 Saram 객체를 생성하여 반환합니다.
 * @returns {newSaram} 생성된 Saram 객체
 */
module.exports = function() {
    return new newSaram();
}

/**
 * Saram 객체 생성 함수
 */
function newSaram() {
    this.load = saramLoadModule;
    this.use = saramUseModule;
    this.start = saramStartServer;
    this.getModuleContentByName = saramGetModuleContentByName;
    this.getModuleObjectByMid = saramGetModuleObjectByMid;
    this.weld = saramWeld;
    this.addReceiver = saramAddReceiver;

    this.call = {
        get:function(path, query, callback){
            serverRequest(this, 'GET', path, query, null, callback);
        },
        post:function(path, query, data, callback){
            serverRequest(this, 'POST', path, query, data, callback);
        },
        put:function(path, query, data, callback){
            serverRequest(this, 'PUT', path, query, data, callback);
        },
        delete:function(path, query, data, callback){
            serverRequest(this, 'DELETE', path, query, data, callback);
        }
    };

    this.moduleContents = {};
    this.moduleObjects = {};
    this.pipeBundle = new bundle();

    var rootPipe = {type:"WELD", name:"root", url:"/", action:"root"};
    initPipe(this, rootPipe);
    this.pipeBundle.addPipe(rootPipe);
}

/**
 * saram.load - Saram 객체에 모듈을 로드 하는 함수
 * @param moduleContent
 */
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

/**
 * saram.use - 모듈을 활성화 시키는 함수
 * 사용하기 전에 saram.load를 통하여 모듈을 로드해야 한다.
 * @param moduleName 모듈 이름
 * @param mid 사용할 모듈 ID (중복 불가)
 * @param obj 모듈 초기화에 필요한 오브젝트 (선택사항)
 */
function saramUseModule(moduleName, mid, obj) {
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

    if(typeof(moduleContent.init)=="function") {
        moduleContent.init(moduleObject.obj, obj);
    }
}

/**
 * saram.start - Saram의 서버 기능을 작동시키는 함수
 * @param port 사용할 포트 (기본값 : 80)
 */
function saramStartServer(port) {
    if(!port) {
        port = 80;
    }

    console.log("Using Saram Framework - info http://saram.elab.kr");
    console.log("Port : " + port);

    var saram = this;

    var req = function(req, res) {
        httpRequest(saram, req, res);
    };

    http.createServer(req).listen(port);
}

/**
 * 모듈 이름을 통해 모듈 컨텐츠를 구하는 함수
 * @param name 모듈 이름
 * @returns {*} 모듈 컨텐츠
 */
function saramGetModuleContentByName(name) {
    var moduleContent = this.moduleContents[name];
    if(!moduleContent)
        return null;
    return moduleContent;
}

/**
 * 모듈 오브젝트의 ID를 가지고 모듈 오브젝트를 구하는 함수
 * @param mid 모듈 오브젝트 ID
 * @returns {*} 모듈 오브젝트
 */
function saramGetModuleObjectByMid(mid) {
    var moduleObject = this.moduleObjects[mid];
    if(!moduleObject)
        return null;
    return moduleObject;
}

/**
 * 상위 모듈의 파이프에서 하위 모듈의 파이프로 연결하는 함수
 *
 * saram.weld([mid], [path]); : 루트 pipe에 모듈 연결
 * saram.weld([parentMid], [childMid], [path], [weld]); : 부모모듈에 자식 모듈 연결
 *
 * @param parentMid 부모 모듈 오브젝트 ID
 * @param childMid 자식 모듈 오브젝트 ID
 * @param path 경로
 * @param weld 연결할 weld 이름(선택사항)
 */
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

/**
 * 모듈 이벤트 리시버를 등록하는 함수
 * 리시버를 등록하면 특정 모듈의 이벤트를 감시할 수 있다.
 *
 * saram.addReceiver([targetMid], [eventName], [mid], [action]); : targetMid의 eventName의 이벤트가 호출되면 mid의 action을 호출한다.
 *
 * @param targetMid 감시할 모듈 오브젝트 ID
 * @param eventName 감시할 이벤트 이름
 * @param receiverMid 리시버 모듈 오브젝트 ID
 * @param action 이벤트 발생시 호출할 리시버 Action
 */
function saramAddReceiver(targetMid, eventName, receiverMid, action) {
    var targetObject = this.getModuleObjectByMid(targetMid);
    var receiverObject = this.getModuleObjectByMid(receiverMid);
    var receiverContent = this.getModuleContentByName(receiverObject.getModuleName());

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

    event.push({receiverContent:receiverContent, receiverObject:receiverObject, action:action});
}

/**
 * saram.weld의 내부 루틴
 * @param saram Saram 객체
 * @param parentMid 부모 모듈 오브젝트 ID
 * @param childMid 자식 모듈 오브젝트 ID
 * @param path 경로
 * @param weld 연결할 weld 이름(선택사항)
 */
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

/**
 * 파이프 초기화 함수
 * @param saram Saram 객체
 * @param pipe 초기화할 파이트
 */
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

/**
 * 모듈의 번들을 설정하는 함수
 * @param saram Saram 객체
 * @param moduleObject 모듈 오브젝트 ID
 */
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

/**
 * Http 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param req node.js HTTP Request Object
 * @param res node.js HTTP Response Object
 */
function httpRequest(saram, req, res) {
    var method = req.method.toLowerCase();
    if(method != "get" && method != "post" && method != "put" && method != "delete") {
        return;
    }
    req.sender = {type:"http"};
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

/**
 * Server 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param method 요청 메소드
 * @param path 요청 경로
 * @param query 요청 쿼리
 * @param data 요청 데이터
 * @param callback 콜백 함수
 */
function serverRequest(saram, method, path, query, data, callback) {
    var req = {};
    req.sender = {type:"server", name:"local"};
    req.method = method;
    req.query = query;
    req.path = path;
    req.data = data;

    var pipeline = saram.pipeBundle.getPipeline(req.method, req.path);
    //404 Error
    if(!pipeline.found) {
        callback(null);
        return;
    }

    var ctx = new context(saram, req, res, pipeline);
    request(saram, ctx);
}

/**
 * 각 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param ctx Context
 * @returns {*}
 */
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

    //파라미터
    ctx.req.param = {};
    for(var index in nowPipe.match) {
        var index = Number(index);
        if(!index || index == NaN || index == 0) {
            continue;
        }
        ctx.req.param[nowPipe.pipe.rawPath.param[index-1]] = nowPipe.match[index];
    }

    callAction(nowPipe.moduleContent, nowPipe.moduleObject, actionName, ctx, function(){request(saram, ctx);});
}

/**
 * 이벤트를 호출하는 함수
 * 이 함수가 호출되면 리시버에게 이벤트가 호출됬다는 것을 알림
 * @param moduleObject 모듈 오브젝트
 * @param event 이벤트 이름
 * @param ctx Context
 * @param callback 콜백 함수
 */
function callEvent(moduleObject, event, ctx, callback) {
    var receiverList = moduleObject.event[event];
    if(!receiverList) {
        callback();
        return;
    }

    callReceiver(receiverList.slice(0), ctx, callback);
}

/**
 * 이벤트 리시버를 호출하는 함수
 * 재귀함수로 동작하며 매 호출 시 리시버 리스트에서 한개씩 꺼내서 리시버를 동작시킨다.
 * @param receiverList 호출할 리시버 리스트
 * @param ctx Context
 * @param callback 콜백 함수
 */
function callReceiver(receiverList, ctx, callback) {
    var receiver = receiverList.shift();
    if(!receiver) {
        callback();
        return;
    }

    callAction(receiver.receiverContent, receiver.receiverObject, receiver.action, ctx, function(){
        callReceiver(receiverList, ctx, callback);
    });
}

/**
 * 모듈 Action 호출 함수
 *
 * @param moduleContent Module Content
 * @param moduleObject Module Object
 * @param actionName Action Name
 * @param ctx Context
 * @param step Call Next Step Function
 */
function callAction(moduleContent, moduleObject, actionName, ctx, step) {
    callEvent(moduleObject, "call." + actionName +".before", ctx, function() {
        var newStep = function() {
            callEvent(moduleObject, "call." + actionName +".after", ctx, function() {
                step();
            });
        }

        var actionFunc = moduleContent.actions[actionName];
        if(!actionFunc || typeof(actionFunc(ctx, newStep)) == "undefined") {
            newStep();
        }
    });

}