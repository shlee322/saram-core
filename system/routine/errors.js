var SaramError = require('../error/index.js');

exports.NotFound = function (ctx) {
    SaramError.apply(this, [ctx]);

    this.code = "error.core.routine.notfound";
    this.message = "존재하지 않는 URL입니다.";
}

exports.NotFound.prototype.__proto__ = SaramError.prototype;
