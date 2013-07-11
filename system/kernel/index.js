var argument = require("./argument.js");
var Protocol = require("../protocol/index.js");
var Error = require("../error/index.js");
var CacheCluster = require("../cache/cluster.js");
var DBCluster = require("../db/cluster.js");
var UUID = require("../uuid/index.js");
var Modules = require("./modules.js");

function Kernel (arg) {
    if(!(this instanceof Kernel))
        return new Kernel(arg);

    arg = argument(arg);

    this.uuid = new UUID();
    this.protocol = new Protocol(this);
    this.cache = new CacheCluster();
    this.db = new DBCluster();
    this.modules = new Modules(this);

    //Load Core Module
    this.modules.load(require('./module/content.js'));
    this.modules.use('saram.core', 'saram.core');
    this._coreModule = this.modules.get('saram.core');

    //Load Assets Module
    this.modules.load(require('../../modules/static/index.js'));
    this.modules.use('elab.static', 'assets');
    this.modules.weld('assets', 'assets');
    this._assets = this.modules.get('assets');

    //Load Manager Module
    if(arg.manager) {
        this.modules.load(require('../../modules/manager/index.js'));
        this.modules.use('elab.manager', 'elab.manager');
        this.manager = this.modules.get('elab.manager');
        this.modules.weld('elab.manager', arg.manager);
    }
}

/**
 * Saram Framework 가동 함수
 */
Kernel.prototype.start = function () {
    this.protocol.start();
}

/**
 * Saram Core의 Module Object
 * @returns {ModuleObject}
 */
Kernel.prototype.getCoreModule = function () {
    return this._coreModule;
}

Kernel.prototype.getAssets = function () {
    return this._assets;
}

module.exports = Kernel;

/**
 * Saram Framework에 모듈을 로드 하는 함수
 *
 * @deprecated
 * @this {Kernel}
 * @param content Module Content
 */
Kernel.prototype.load = function (content) {
    return this.modules.load(content);
}

/**
 * Load를 통하여 로드한 모듈을 활성화 하는 함수
 * 사용되기 이전에 Load를 통하여 모듈을 불러와야 함
 *
 * @deprecated
 * @param name 모듈 이름
 * @param mid  사용할 모듈 ID (중복 불가)
 * @param obj 모듈 초기화에 필요한 오브젝트 (선택사항)
 */
Kernel.prototype.use = function (name, mid, obj) {
    return this.modules.use(name, mid, obj);
}

/**
 * @deprecated
 * @param parentMid
 * @param childMid
 * @param path
 * @param weld
 */
Kernel.prototype.weld = function (parentMid, childMid, path, weld) {
    return this.modules.weld(parentMid, childMid, path, weld);
}
