module.exports = function() {
    this.weldList = {}; //name 기준

    this.weldedBundle = []; //URL 기준
    this.get = [];
    this.post = [];
    this.put = [];
    this.delete = [];

    this.weld = function(path, childBundle, weld) {
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

    this.addPipe = function(pipe) {
        var pipeObject = getPipeObject(this, pipe.type);
        if(pipeObject instanceof Array) {
            pipeObject.push(pipe);
        } else if(pipeObject instanceof Object) {
            pipeObject[pipe.name] = pipe;
        }
    };

    this.getPipeline = function(pipeType, path) {
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

            return {found:true, pipeline:[{pipe:pipe, match:match, moduleContent:this.moduleContent, moduleObject:this.moduleObject}]};
        }
        return {found:false};
    }
}

function getPipeObject(bundleObject, type) {
    var pipeObject = getHttpPipeObject(bundleObject, type);
    if(!pipeObject) {
        if(type.toLowerCase() == 'weld') {
            return bundleObject.weldList;
        }
    }

    return bundleObject.get;
}

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
        var childString = path.substring(match.length);

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
                pipelineObject.pipeline.unshift({pipe:pipe, match:match, moduleContent:bundleObject.moduleContent, moduleObject:bundleObject.moduleObject});
                return pipelineObject;
            }
        }
    }

    return {found:false};
}