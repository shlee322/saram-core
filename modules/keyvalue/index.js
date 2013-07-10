var moduleSys = require('saram-core/system/module/');

/*
    param은 Array로 이루어져 있으며 Array에 들어갈 값은 다음과 같다.
    ["mid", "key"]
    예. obj.param = [["user", "uuid"], ["test", "abcd"]]
 */
module.exports = moduleSys.init({
    getName:function () {
        return "elab.keyvalue";
    },
    init:require('./init.js'),
    info:require('./info.js'),
    actions:require('./actions.js'),
    pipes:require('./pipes.js')
});
