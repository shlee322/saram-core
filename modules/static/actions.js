module.exports = {
    get : function (ctx) {
        var file = ctx.current.module._content[ctx.req.path];
        ctx.errorTry(!file, Error);
        ctx.res.send(file);
    }
}