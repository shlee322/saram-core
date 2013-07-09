var Call = require('./call.js');
var Viewer = require('../viewer/index.js');

function request(ctx, bundle) {
    bundle = bundle ? bundle : ctx.getSaram().getCoreModule().getBundle();

    ctx.run(function () {
        var pipeline = bundle.getPipeline(ctx.req.method, ctx.req.path);
        ctx.errorTry(!pipeline.found, Error);
        routine(ctx, pipeline);
    });
}

function routine(ctx, pipeline) {
    var nowPipe = pipeline.pipeline.shift();
    if(!nowPipe) {
        return;
    }

    if(!nowPipe.module) {
        return routine(ctx, pipeline);
    }

    //ctx.mObj = nowPipe.module.obj;
    var actionName = nowPipe.pipe.action;

    //파라미터
    ctx.req.param = {};
    for(var index in nowPipe.match) {
        if(!index.match(/^[0-9]+$/)) {
            continue;
        }
        var index = Number(index);
        if(index == 0) {
            continue;
        }

        ctx.req.param[nowPipe.pipe.rawPath.param[index-1]] = nowPipe.match[index];
    }

    var viewer = nowPipe.pipe.viewer;
    viewer.setResponse(ctx, function (res) {
        Call.callAction(ctx, nowPipe.module, viewer.getAction(), function (){
            ctx.res = res;
            routine(ctx, pipeline);
        });
    });
}

module.exports = request;