var request = require('request');
var EventContext = require('saram-core/system/eventcontext/index.js');
var RoutineCall = require('saram-core/system/routine/call.js');

var callAction = false;
var callReceiver = false;
var callReceiver2 = false;

var module = {
    getMid : function () { return "testModule" },
    actions : {
        test : function (ctx) {
            callAction = true;
        },
        receiver : function (ctx) {
            callReceiver = true;
        },
        receiver2 : function (ctx) {
            callReceiver2 = true;
        }
    }
};

module._event = {
    "call.test.before" : [{
        module : module,
        action : "receiver"
    }],
    "call.test.after" : [{
        module : module,
        action : "receiver2"
    }]
};

describe('Routine', function() {
    it('#Event+Receiver+Action', function(done) {
        RoutineCall.callAction(new EventContext(null, "saram.test.routine", {}), module, "test", function() {
            done(!(callAction && callReceiver && callReceiver2) ? new Error(body) : undefined);
        });
    });
});