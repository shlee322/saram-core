function SaramError(ctx, code, msg) {
    Error.captureStackTrace(this, SaramError);

    this.mid = ctx.current.module ? ctx.current.module.getMid() : "saram.core";
    this.code = code ? code : "";
    this.message = msg ? msg : "";
}
SaramError.prototype.getErrorType = function() {
    return "saram.error"
};

SaramError.prototype.__proto__ = Error.prototype;
module.exports = SaramError;
