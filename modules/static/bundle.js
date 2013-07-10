var Viewer = require('../../system/viewer/index.js');

function StaticBundle(module) {
    this._module = module;

    this._viewer = Viewer.Engine('get', "file");
}

StaticBundle.prototype.getPipeline = function(pipeType, path) {
    return {found:true, pipeline:[{pipe:{type:"GET", url:path, viewer:this._viewer}, module:this._module}]};
}

module.exports = StaticBundle;
