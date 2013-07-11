var XXHash = require('xxhash');

exports.set = function (ctx, key, value, callback) {
    var hash = XXHash.hash(new Buffer(key), 0x654C6162);

    var clusterName = "default";

    var cluster = ctx.getSaram().cache.getCluster(clusterName);
    return cluster[hash%cluster.length].set(key, value, callback);
}

exports.get = function (ctx, key, callback) {
    var hash = XXHash.hash(new Buffer(key), 0x654C6162);

    var clusterName = "default";

    var cluster = ctx.getSaram().cache.getCluster(clusterName);
    return cluster[hash%cluster.length].get(key, callback);
}
