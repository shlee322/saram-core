function SaramError(ctx) {
    Error.captureStackTrace(this, SaramError);

    this.mid = ctx.current.module.getMid();
    this.code = "";
    this.message = "";
}
SaramError.prototype.getErrorType = function() {
    return "saram.error"
};

SaramError.prototype.__proto__ = Error.prototype;
module.exports = SaramError;