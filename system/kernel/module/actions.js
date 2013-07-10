module.exports = {
    root:function(ctx) {},
    serverOnly:function(ctx) {
        ctx.errorTry(ctx.req.sender.type != "server", Error);
    }
}
