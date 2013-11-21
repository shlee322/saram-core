var Log = require('../log/index.js');

/**
 * 이벤트를 호출하는 함수
 * 이 함수가 호출되면 리시버에게 이벤트가 호출됬다는 것을 알림
 * @param moduleObject 모듈 오브젝트
 * @param event 이벤트 이름
 * @param ctx Context
 * @param callback 콜백 함수
 */
exports.callEvent = function (ctx, module, event, callback) {
    var receiverList = module._event[event];
    if(Log.isView(ctx, Log.LEVEL.DEBUG)) Log.debug(ctx, "Call Event " + module.getMid() + " " + event);

    //이 이벤트에 연결된 리시버가 하나도 존재하지 않을 경우
    if(!receiverList || receiverList.length < 1) {
        callback();
        return;
    }

    exports.callReceiver(ctx, receiverList.slice(0), callback);
}

/**
 * 이벤트 리시버를 호출하는 함수
 * 재귀함수로 동작하며 매 호출 시 리시버 리스트에서 한개씩 꺼내서 리시버를 동작시킨다.
 * @param receiverList 호출할 리시버 리스트
 * @param ctx Context
 * @param callback 콜백 함수
 */
exports.callReceiver = function (ctx, receiverList, callback) {
    var receiver = receiverList.shift();
    if(!receiver) {
        //TODO : 그냥 다음꺼 넘어가게 할까?
        return;
    }

    var temp = ctx.currentReceiver;
    ctx.currentReceiver = receiver;
    var saveIsAutoNext = ctx.current.autoNext;

    exports.callAction(ctx, receiver.module, receiver.action, function (){
        ctx.current.autoNext = saveIsAutoNext;
        ctx.currentReceiver = temp;

        if(receiverList.length < 1) {
            //if(ctx.current.autoNext) {
                callback();
            //}
            return;
        }
        exports.callReceiver(ctx, receiverList, callback);
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
exports.callAction = function (ctx, module, action, next) {
    exports.callEvent(ctx, module, "call." + action +".before", function() {
        var after = function() {
            exports.callEvent(ctx, module, "call." + action +".after", function() {
                next();
            });
        }

        if(Log.isView(ctx, Log.LEVEL.DEBUG)) Log.debug(ctx, "Call Action " + module.getMid() + " " + action);

        var actionFunc = module.actions[action];
        if(!actionFunc) {
            Log.warning(ctx, "Null Action " + module.getMid() + " " + action);
        }
        //ctx.before = ctx.current;
        ctx.current = { module:module, action:action, autoNext:true, next:after };

        ctx.req.body.readBody(function() {
            _callActionRoutine(ctx, actionFunc, after);
        });
    });
}

function _callActionRoutine(ctx, actionFunc, nextFunc) {
    ctx.run(function() {
        actionFunc(ctx);

        if( ctx.current.autoNext ) {
            nextFunc();
        }
    });
}
