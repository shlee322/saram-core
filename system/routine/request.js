var Call = require('./call.js');
var Log = require('../log/index.js');
var Viewer = require('../viewer/index.js');
var RoutineError = require('./errors.js');

function request(ctx, bundle) {
    bundle = bundle ? bundle : ctx.getSaram().getCoreModule().getBundle();

    Log.info(ctx, "Request " + ctx.req.method + " " + bundle._module.getMid() + ctx.req.path);

    ctx.run(function () {
        var pipeline = bundle.getPipeline(ctx.req.method, ctx.req.path);
        ctx.errorTry(!pipeline.found, RoutineError.NotFound);
        routine(ctx, pipeline, function () {
            ctx.errorTry(!ctx.req.body.isRead(), Error); //용량 큼
            ctx.res.sendResponse();
        });
    });
}

function routine(ctx, pipeline, cb) {
    var nowPipe = pipeline.pipeline.shift();
    if(!nowPipe) {
        cb();
        return;
    }

    if(!nowPipe.module) {
        return routine(ctx, pipeline, cb);
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

    Call.callAction(ctx, nowPipe.module, nowPipe.pipe.action, function (){
        routine(ctx, pipeline, cb);
    });
}

module.exports = request;
