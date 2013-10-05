module.exports = {
    root : function(ctx) {},
    setBodyMaxSize : function(ctx) {
        if(!ctx.currentReceiver)
            return;

        var size = ctx.currentReceiver.size;
        if(!size)
            return;
        ctx.current.autoNext = false;
        ctx.req.setMaxSize(size, ctx.current.next);
    },
    response : function(ctx) {
    },
    serverOnly : function(ctx) {
        ctx.errorTry(ctx.req.sender.type != "server", Error);
    }
}
