/**
 * @namespace: Saram Core (http://saram.elab.kr)
 * @author: Lee Sanghyuck (http://profile.elab.kr)
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
 * bundle : 각종 pipe와 weld를 가지고 있는 객체
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
var snowflake = require('snowflake-node');
var path = require('path');
var bundle = require('./module/bundle.js');
var db = require('./db/index.js');
var cache = require('./cache/index.js');
var context = require('./context.js');
var call = require('./call.js');
var request = require('./request.js');
var custom = require('./custom.js');
var seCtx = require('./serverEventContext.js');

/**
 * 새로운 Saram 객체를 생성하여 반환합니다.
 * @returns {newSaram} 생성된 Saram 객체
 */
module.exports = function(option) {
    if(!option) {
        option = {};
    }
    if(!(option.useManager instanceof Boolean)) {
        option.useManager = true;
    }
    if(!(option.clusterFile instanceof String)) {
        option.clusterFile = "cluster.json";
    }
    if(!(option.nodeFile instanceof String)) {
        option.nodeFile = "node.json";
    }
    return new newSaram(option);
}

function loadFile(file) {
    var fs = require('fs');
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) {
    }
    return null;
}
function getNode(nodeFile) {
    var data = loadFile(nodeFile);
    return {
        getDomain : function() {
            return data ? data.domain : [];
        }
    };
}
function getCluster(clusterFile) {
    var data = loadFile(clusterFile);
    return null;
}
/**
 * Saram 객체 생성 함수
 */
function newSaram(option) {
    var saram = this;

    this.load = saramLoadModule;
    this.use = saramUseModule;
    this.start = saramStartServer;
    this.getModuleContentByName = saramGetModuleContentByName;
    this.getModuleObjectByMid = saramGetModuleObjectByMid;
    this.weld = saramWeld;
    this.addReceiver = saramAddReceiver;
    this.autoLoad = saramAutoLoad;

    this.db = db(this);
    this.cache = cache(this);

    var snow = new snowflake.snowflake;
    this.generateUID = function (cb) {
        cb(snow.generate());
    }
    this.sharding = function (uid, len, cb) {
        cb(snow.sharding(uid, len));
    }

    this.call = {
        get:function(path, query, callback, rootBundleMid, extend){
            request.serverRequest(saram, 'GET', rootBundleMid, path, query, null, callback, extend);
        },
        post:function(path, query, data, callback, rootBundleMid, extend){
            request.serverRequest(saram, 'POST', rootBundleMid, path, query, data, callback, extend);
        },
        put:function(path, query, data, callback, rootBundleMid, extend){
            request.serverRequest(saram, 'PUT', rootBundleMid, path, query, data, callback, extend);
        },
        delete:function(path, query, data, callback, rootBundleMid, extend){
            request.serverRequest(saram, 'DELETE', rootBundleMid, path, query, data, callback, extend);
        }
    };

    this.moduleContents = {};
    this.moduleObjects = {};

    this.rootModuleContent = {
        actions:{
            root:function(ctx, next) {},
            serverOnly:function(ctx, next) {
                if(ctx.req.sender.type != "server") {
                    throw ctx.current.module.error('perm.notserver');
                }
            }
        }
    };
    this.rootModuleObject = {
        getModuleName:function() {
            return "saram.core";
        },
        getMid:function() {
            return null;
        },
        error:function(code, obj) {
            var error = new Error();
            error.type = "saram.error";
            error.errorModule = moduleObject.obj;
            error.errorCode = code;
            error.errorMessage = moduleContent.error ? moduleContent.error[code] : "";
            error.errorObject = obj;
            return error;
        },
        errorTry:function(condition, error, obj) {
            if(condition) {
                if(error instanceof Error) {
                    throw error;
                }
                throw moduleObject.error(error, obj);
            }
        }
    };
    this.rootModuleObject.obj = { getModuleName:this.rootModuleObject.getModuleName,
        getMid:this.rootModuleObject.getMid,
        error:this.rootModuleObject.error,
        errorTry:this.rootModuleObject.errorTry
    };
    this.rootModuleObject.event = {};
    this.rootModuleObject.pipeBundle = new bundle();
    this.rootModuleObject.pipeBundle.moduleContent = this.rootModuleContent;
    this.rootModuleObject.pipeBundle.moduleObject = this.rootModuleObject;

    var rootPipe = {type:"WELD", name:"root", url:"/", action:"root"};
    initPipe(this, rootPipe);
    this.rootModuleObject.pipeBundle.addPipe(rootPipe);

    this.pipeBundle = this.rootModuleObject.pipeBundle;

    //스태틱 로드 - 차후 사용
    //this.load(require('./modules/static/'));

    //커스텀 로드
    this.custom = new custom(this);

    //노드, 클러스터
    this.node = getNode(option.nodeFile);
    this.cluster = getCluster(option.clusterFile);

    //매니저 로드
    this.load(require('./modules/manager/'));
    this.use('elab.manager', 'core.manager');
    //매니저에서 관리할 모듈 디렉토리 추가
    //this.getModuleObjectByMid('core.manager').callAction('addModulesDir', {dir:path.resolve(__dirname, 'modules/')},{});
    //웹 매니저 페이지 활성화
    if(option.useManager) {
        //this.weld('core.manager', 'admin');
    }
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

    if(typeof(moduleContent.load)=="function") {
        moduleContent.load(seCtx(this, moduleContent, null, 'load'));
    }
}

/**
 * saram.use - 모듈을 활성화 시키는 함수
 * 사용하기 전에 saram.load를 통하여 모듈을 로드해야 한다.
 * @param moduleName 모듈 이름
 * @param mid 사용할 모듈 ID (중복 불가)
 * @param obj 모듈 초기화에 필요한 오브젝트 (선택사항)
 */
function saramUseModule(moduleName, mid, obj) {
    if(!obj) {
        obj = {};
    }
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
    moduleObject.error = function(code, obj) {
        var error = new Error();
        error.type = "saram.error";
        error.errorModule = moduleObject.obj;
        error.errorCode = code;
        error.errorMessage = moduleContent.error ? moduleContent.error[code] : "";
        error.errorObject = obj;
        return error;
    }
    moduleObject.errorTry = function(condition, error, obj) {
        if(condition) {
            if(error instanceof Error) {
                throw error;
            }
            throw moduleObject.error(error, obj);
        }
    }

    moduleObject.obj = {getModuleName:moduleObject.getModuleName, getMid:moduleObject.getMid, error:moduleObject.error, errorTry:moduleObject.errorTry};

    this.moduleObjects[mid] = moduleObject;

    settingModuleBundle(this, moduleObject);

    if(typeof(moduleContent.init)=="function") {
        var ctx = seCtx(this, moduleContent, moduleObject, 'init');
        ctx.req.body = obj;
        moduleContent.init(ctx);
    }
}

function saramAutoLoad(moduleContent, mid, obj, parentMid, path, weld) {
    this.load(moduleContent);
    this.use(moduleContent.getName(), mid, obj);

    //content, mid, obj, rootPath
    if(parentMid && !path && !weld) {
        var temp = parentMid;
        parentMid = mid;
        mid = temp;
    }
    //content, mid, obj
    if(!parentMid) {
        parentMid = mid;
    }
    this.weld(parentMid, mid, path, weld);
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
        request.httpRequest(saram, req, res);
    };

    http.createServer(req).listen(port);
}

/**
 * 모듈 이름을 통해 모듈 컨텐츠를 구하는 함수
 * @param name 모듈 이름
 * @returns {*} 모듈 컨텐츠
 */
function saramGetModuleContentByName(name) {
    if(name == "saram.core") {
        return this.rootModuleContent;
    }
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
    if(!targetMid) { //루트
        targetObject = this.rootModuleObject;
    }
    var receiverObject = this.getModuleObjectByMid(receiverMid);
    if(!receiverMid) {
        receiverObject = this.rootModuleObject;
    }
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
        parentPipeBundle = saram.rootModuleObject.pipeBundle;
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

    pipe.rawPath.path = "^" + path.replace(reg, "/([^/]+)");

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