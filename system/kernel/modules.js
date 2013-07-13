var ModuleContent = require("../module/content.js");
var ModuleObject = require("../module/object.js");
var EventContext = require("../eventcontext/index.js");
var Error = require("../error/index.js");

function Modules(saram) {
    this._saram = saram;
    this._loadedModules = {};
    this._modules = {};
}

Modules.prototype.load = function (content) {
    var _this = this;
    var ctx = new EventContext(this._saram, "saram.core.kernel.modules.load");

    ctx.run(function () {
        var isModule = content instanceof ModuleContent;

        ctx.errorTry(!isModule, Error);
        ctx.errorTry(_this._loadedModules[content.getName()], Error);

        _this._loadedModules[content.getName()] = content;

        if(typeof content.load == "function")
            content.load(ctx);
    });
}

Modules.prototype.use = function (name, mid, arg) {
    var _this = this;
    var ctx = new EventContext(this._saram, "saram.core.kernel.modules.use", arg);

    ctx.run(function () {
        var content = _this._loadedModules[name];

        ctx.errorTry(!content, Error);
        ctx.errorTry(_this._modules[mid], Error);

        var module = new ModuleObject(content, mid);
        _this._modules[mid] = module;

        ctx.current = { module : module };

        if(typeof module.init == "function")
            module.init(ctx);
    });
}

Modules.prototype.get = function (mid) {
    return this._modules[mid];
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
Modules.prototype.weld = function (parentMid, childMid, path, weld) {
    if(!parentMid || !childMid)
        return;

    if(!path) {
        this.weldRoutine(null, parentMid, childMid, null);
        return;
    }

    if(!weld) {
        this.weldRoutine(parentMid, childMid, path, null);
    } else {
        this.weldRoutine(parentMid, childMid, path, weld);
    }
}

/**
 * saram.weld의 내부 루틴
 * @param saram Saram 객체
 * @param parentMid 부모 모듈 오브젝트 ID
 * @param childMid 자식 모듈 오브젝트 ID
 * @param path 경로
 * @param weld 연결할 weld 이름(선택사항)
 */
Modules.prototype.weldRoutine = function(parentMid, childMid, path, weld) {
    if(weld instanceof String) {
        weld = [weld];
    }

    var parentObject = this.get(parentMid);
    var childObject = this.get(childMid);

    if(parentMid && !parentObject) {
        console.log(parentMid + " ModuleObject가 존재하지 않습니다.");
        return;
    }
    if(!childObject) {
        console.log(childMid + " ModuleObject가 존재하지 않습니다.");
    }

    var parentPipeBundle = null;
    if(parentObject) {
        parentPipeBundle = parentObject._bundle;
    } else {
        parentPipeBundle = this._saram.getCoreModule()._bundle;
    }
    //일단 덮어쓰자
    /*if(bundle.getWeldedBundle(weldName, pipe)) {
     console.log("이미 [1] 모듈 오브젝트 안에 [2] Weld가 존재합니다.");
     return;
     } */

    parentPipeBundle.weld(path, childObject._bundle, weld);
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
Modules.prototype.addReceiver = function (targetMid, eventName, receiverMid, action) {
    var target = this.get(targetMid);
    if(!targetMid) { //루트
        target = this._saram.getCoreModule();
    }

    var receiver = this.get(receiverMid);
    if(!receiverMid) {
        receiver = this._saram.getCoreModule();
    }

    target.addReceiver(eventName, receiver, action);
}

module.exports = Modules;
