module.exports = {
    callEvent: callEvent,
    callReceiver: callReceiver,
    callAction: callAction
};

/**
 * 이벤트를 호출하는 함수
 * 이 함수가 호출되면 리시버에게 이벤트가 호출됬다는 것을 알림
 * @param moduleObject 모듈 오브젝트
 * @param event 이벤트 이름
 * @param ctx Context
 * @param callback 콜백 함수
 */
function callEvent(moduleObject, event, ctx, callback) {
    var receiverList = moduleObject.event[event];
    if(!receiverList) {
        callback();
        return;
    }

    callReceiver(receiverList.slice(0), ctx, callback);
}

/**
 * 이벤트 리시버를 호출하는 함수
 * 재귀함수로 동작하며 매 호출 시 리시버 리스트에서 한개씩 꺼내서 리시버를 동작시킨다.
 * @param receiverList 호출할 리시버 리스트
 * @param ctx Context
 * @param callback 콜백 함수
 */
function callReceiver(receiverList, ctx, callback) {
    var receiver = receiverList.shift();
    if(!receiver) {
        callback();
        return;
    }

    callAction(receiver.receiverContent, receiver.receiverObject, receiver.action, ctx, function(){
        callReceiver(receiverList, ctx, callback);
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
function callAction(moduleContent, moduleObject, actionName, ctx, step) {
    callEvent(moduleObject, "call." + actionName +".before", ctx, function() {
        var newStep = function() {
            callEvent(moduleObject, "call." + actionName +".after", ctx, function() {
                step();
            });
        }

        var actionFunc = moduleContent.actions[actionName];
        ctx.current = {module:moduleObject.obj , moduleContent:moduleContent, moduleObject:moduleObject, action:actionName};
        if(!actionFunc || typeof(actionFunc(ctx, newStep)) == "undefined") {
            newStep();
        }
    });
}