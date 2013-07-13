var SaramError = require('../../../error/index.js');

exports.Redirect = function (ctx) {
    exports.Response.apply(this, [ctx]);

    this.responseCode = 300;
    this.code = "error.elab.keyvalue.notfond";
    this.message = "Multiple Choices";
}

exports.Response = function (ctx) {
    SaramError.apply(this, [ctx]);
}

exports.Redirect.prototype.__proto__ = exports.Response.prototype;
exports.Response.prototype.__proto__ = SaramError.prototype;