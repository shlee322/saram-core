exports.set = function (ctx, key, value, callback) {
    var clusterName = "default";

    var cluster = ctx.getSaram().cache.getCluster(clusterName);
    return cluster[0].set(key, value, callback);
}

exports.get = function (ctx, key, callback) {
    var clusterName = "default";

    var cluster = ctx.getSaram().cache.getCluster(clusterName);
    return cluster[0].get(key, callback);
}
