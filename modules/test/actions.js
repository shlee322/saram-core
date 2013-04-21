module.exports = {
    testpipe : function (ctx, step) {
        console.log("testpipe");
    },
    index : function (ctx, step) {
        console.log("index");
    },
    index_get : function (ctx, step) {
        console.log("index_get");
    },
    get_1234 : function (ctx, step) {
        console.log("get_1234");
    },
    get_test : function (ctx, step) {
        console.log("get_test");
    },
    get_param : function (ctx, step) {
        console.log(ctx.req.param);
    }
}