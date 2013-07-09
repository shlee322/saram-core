function SaramError(ctx) {
    Error.captureStackTrace(this, SaramError);

    this.mid = ctx.current.module ? ctx.current.module.getMid() : "saram.core";
    this.code = "";
    this.message = "";
}
SaramError.prototype.getErrorType = function() {
    return "saram.error"
};

SaramError.prototype.__proto__ = Error.prototype;
module.exports = SaramError;