var Cluster = require('../cluster/');

function CacheCluster() {
    Cluster.apply(this);
}

CacheCluster.prototype.connectNode = function (ctx, nodeUrl) {
    var protocol = nodeUrl.protocol.substring(0, nodeUrl.protocol.length - 1);

    var hostname = nodeUrl.hostname;
    var port = nodeUrl.port;
    if(!port)
        port = null;

    var account = null;
    var passwd = null;
    if(nodeUrl.auth) {
        var pwIndex = nodeUrl.auth.indexOf(':');
        if(pwIndex != -1) {
            account = nodeUrl.auth.substring(0,pwIndex);
            passwd = nodeUrl.auth.substring(pwIndex + 1);
        } else {
            account = nodeUrl.auth;
        }
    }

    var database = nodeUrl.path.substring(1);

    var moduleFunc = require('./modules/' + protocol + '/');
    return new moduleFunc({
        hostname : hostname,
        port : port,
        account : account,
        password : passwd,
        database : database
    });
}

CacheCluster.prototype.__proto__ = Cluster.prototype;
module.exports = CacheCluster;
