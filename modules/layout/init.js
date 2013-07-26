function initLayoutModule(ctx) {
    var _this = this;

    ctx.req.data.readKey(["viewer"], function() {
        _this.config = {};

        _this.config.viewer = ctx.req.data.getValue("viewer");
    });
}

module.exports = initLayoutModule;
