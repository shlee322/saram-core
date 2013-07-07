/**
 * @namespace: Pipe Bundle (http://saram.elab.kr)
 * @author: Lee Sanghyuck (http://profile.elab.kr)
 * @version: 0.1
 * @since: 2013.04.20
 * @description: Saram Pipe Bundle 입니다.
 *
 */
function Bundle(module) {
    this._module = module;

    this.weldList = {}; //name 기준

    this.weldedBundle = {}; //URI 기준
    this.get = [];
    this.post = [];
    this.put = [];
    this.delete = [];

    for(var i in this._module.pipes) {
        var pipe = this._module.pipes[i];
        this.addPipe(pipe);
    }
}

/**
 * 다른 Bundle를 해당 Bundle 아래에 연결
 *
 * @param path 경로
 * @param childBundle 자식 Bundle
 * @param weld 특정 weld만 연결(선택)
 */
Bundle.prototype.weld = function (path, childBundle, weld) {
    var target = weld;
    if(target == null) {
        target = Object.keys(this.weldList);
    }

    for(var i in target) {
        var pipe = this.weldList[target[i]];

        if(!this.weldedBundle[pipe.rawPath.path]) {
            var weldedBundle = new Object();
            weldedBundle.pipe = pipe;
            weldedBundle.bundles = {};

            this.weldedBundle[pipe.rawPath.path] = weldedBundle;
        }

        this.weldedBundle[pipe.rawPath.path].bundles[path] = childBundle;
    }
};

/**
 * 자식 파이프 추가
 * @param pipe 추가할 파이프
 */
Bundle.prototype.addPipe = function (pipe) {
    var pipeObject = getPipeObject(this, pipe.type);
    if(pipeObject instanceof Array) {
        pipeObject.push(pipe);
    } else if(pipeObject instanceof Object) {
        pipeObject[pipe.name] = pipe;
    }
}

/**
 * 요청을 분석하여 요청에 맞는 파이프 라인을 생성하는 함수
 *
 * @param pipeType 파이프 종류
 * @param path 경로
 * @returns {*} pipeline
 */
Bundle.prototype.getPipeline = function(pipeType, path) {
    //weldedBundle 탐색
    var weldedBundlePipeline = getWeldedBundlePipeline(this, pipeType, path);
    if(weldedBundlePipeline.found)
        return weldedBundlePipeline;

    //Method 탐색
    var pipeObject = getPipeObject(this, pipeType);
    for(var i in pipeObject) {
        var pipe = pipeObject[i];

        var match = pipe.rawPath.match(path);
        if(!match) {
            continue;
        }

        return {found:true, pipeline:[{pipe:pipe, match:match, module:this._module}]};
    }

    //메인이면 우선 찾았다고 보고
    if(path=="/") {
        return {found:true, pipeline:[{pipe:{type:"GET", url:"/", redirect:"/main.view"}, module:this._module}]};
    }

    return {found:false};
}

/**
 * 파이프 타입에 따라 해당 파이프 리스트를 리턴하는 함수
 *
 * @param bundleObject 파이프를 추출할 Bundle
 * @param type 파이프 타입
 * @returns {*} 파이프 리스트
 */
function getPipeObject(bundleObject, type) {
    var pipeObject = getHttpPipeObject(bundleObject, type);
    if(!pipeObject) {
        if(type.toLowerCase() == 'weld') {
            return bundleObject.weldList;
        }
        return bundleObject.get;
    }

    return pipeObject;
}

/**
 * getPipeObject 함수와 같음. (단, HTTP 메소드에 한함)
 *
 * @param bundleObject 파이프를 추출할 Bundle
 * @param type 파이프 타입
 * @returns {*} 파이프 리스트
 */
function getHttpPipeObject(bundleObject, type) {
    if(type.toLowerCase() == 'get') {
        return bundleObject.get;
    } else if(type.toLowerCase() == 'post') {
        return bundleObject.post;
    } else if(type.toLowerCase() == 'put') {
        return bundleObject.put;
    } else if(type.toLowerCase() == 'delete') {
        return bundleObject.delete;
    }

    return null;
}

/**
 * 자식 Bundle에서 파이프라인을 추출하는 함수
 *
 * @param bundleObject 파이프를 추출할 Bundle
 * @param pipeType 파이프 타입
 * @param path 경로
 * @returns {*} 추출된 파이프라인
 */
function getWeldedBundlePipeline(bundleObject, pipeType, path) {
    if('/' == path)
        return {found:false};

    for(var i in bundleObject.weldedBundle) {
        var weldedBundle = bundleObject.weldedBundle[i];
        var pipe = weldedBundle.pipe;

        var match = pipe.rawPath.match(path);
        if(!match) {
            continue;
        }

        var matchString = match[0];
        var childString = path.substring(matchString.length); //bug!

        var bundles = weldedBundle.bundles;
        for(var weldPath in bundles) {
            if(!childString.match("^"+weldPath)) {
                continue;
            }

            var childBundle = bundles[weldPath];
            if(childBundle) {
                var pipelineObject = childBundle.getPipeline(pipeType, childString.substring(weldPath.length));
                if(!pipelineObject.found) {
                    continue;
                }
                pipelineObject.pipeline.unshift({pipe:pipe, match:match, module:bundleObject._module});
                return pipelineObject;
            }
        }
    }

    return {found:false};
}

module.exports = Bundle;