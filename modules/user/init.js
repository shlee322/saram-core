function initUserModule(ctx) {
    var _this = this;

    _this.config = {};

    _this.config.token = ctx.req.body.getValue("token", "access_token");
    _this.config.var = ctx.req.body.getValue("var", "auth");
}

module.exports = initUserModule;
