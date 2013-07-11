function initUserModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["token"], function() {
        _this.config = {};

        _this.config.token = ctx.req.data.getValue("token", "access_token");
        _this.config.var = ctx.req.data.getValue("var", "auth");
    });
}

module.exports = initUserModule;
