module.exports = {
    testpipe : function (ctx, step) {
        console.log("testpipe");
    },
    index : function (ctx, step) {
        console.log("index");
        ctx.res.send({test:'index'});
    },
    index_get : function (ctx, step) {
        console.log("index_get");
    },
    get_1234 : function (ctx, step) {
        console.log("get_1234");
    },
    get_test : function (ctx, step) {
        console.log("get_test");
        ctx.res.send({test:"world"});
    },
    get_param : function (ctx, step) {
        console.log(ctx.req.param);
        ctx.res.send({test:"a"});
    },
    eventtest : function(ctx, step) {
        console.log("before test");
    },
    eventtest2 : function(ctx, step) {
        console.log("after test");
    }
}