var SaramError = require('../../system/error/index.js');

exports.NotFound = function (ctx) {
    SaramError.apply(this, [ctx]);

    this.code = "error.elab.keyvalue.notfond";
    this.message = "존재하지 않는 키입니다.";
}

exports.DisabledList = function (ctx) {
    SaramError.apply(this, [ctx]);

    this.code = "error.elab.keyvalue.disabledlist";
    this.message = "List 기능이 활성화 되지 않았습니다.";
}

exports.NotFound.prototype.__proto__ = SaramError.prototype;
