var Context = require("./context.js");
var request = require('../routine/request.js');

exports.get = function (ctx, path, data, callback) {
    return exports.request(ctx, 'GET', path, data, callback);
};

exports.post = function (ctx, path, data, callback) {
    return exports.request(ctx, 'POST', path, data, callback);
};

exports.put = function (ctx, path, data, callback) {
    return exports.request(ctx, 'PUT', path, data, callback);
};

exports.delete = function (ctx, path, data, callback) {
    return exports.request(ctx, 'DELETE', path, data, callback);
};

exports.request = function (pernet, method, path, data, callback) {
    if(!data.query && !data.data && !data.weld && !data.param)
        return exports.request(pernet, method, path, {query:data}, callback);

    var ctx = new Context(pernet, method, path, data, callback);
    var rootModule = data.weld ? data.weld : ctx.getSaram().getCoreModule();
    request(ctx, rootModule.getBundle());
}