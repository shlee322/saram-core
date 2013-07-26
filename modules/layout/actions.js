var Response = require('./response.js');

module.exports = {
    layout : function (ctx) {
        ctx.current.autoNext = false;

        ctx.current.module.config.viewer.setResponse(ctx, function(res) {
            ctx.res = new Response(ctx.res);
            ctx.current.next();
        });
    }
}