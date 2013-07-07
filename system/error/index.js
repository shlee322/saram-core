function SaramError(ctx) {
    Error.captureStackTrace(this, SaramError);
}
SaramError.prototype.getErrorType = function() {
    return "saram.error"
};

SaramError.prototype.__proto__ = Error.prototype;
module.exports = SaramError;