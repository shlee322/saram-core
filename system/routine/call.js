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
    if(!receiverList) {
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
        callback();
        return;
    }

    exports.callAction(ctx, receiver.module, receiver.action, function (){
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
exports.callAction = function (ctx, module, actionName, next) {
    exports.callEvent(ctx, module, "call." + actionName +".before", function() {
        var after = function() {
            exports.callEvent(ctx, module, "call." + actionName +".after", function() {
                next();
            });
        }

        var actionFunc = module.actions[actionName];
        //ctx.before = ctx.current;
        ctx.current = {module:module, action:actionName, autoNext:true, next:after};

        actionFunc(ctx);
        if( ctx.current.autoNext ) {
            next();
        }
    });
}
