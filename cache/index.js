var snowflake = require('snowflake-node');
var url = require('url');
var XXHash = require('xxhash');


module.exports = function(saram) {
    return new newCache(saram);
}

function newCache(saram) {
    this.saram = saram;
    this.addNode = addNode;
    this.set = set;
    this.get = get;

    this.cluster = {};
}

function addNode(nodeUrlStr, clusterName) {
    if(!clusterName) {
        clusterName = 'default';
    }

    var nodeUrl = url.parse(nodeUrlStr);

    if(!nodeUrl.protocol) {
        console.log("프로토콜이 정의되지 않았습니다.");
        return;
    }

    var protocol = nodeUrl.protocol.substring(0, nodeUrl.protocol.length - 1);
    var hostname = nodeUrl.hostname;
    var port = nodeUrl.port;
    if(!port) {
        port = null;
    }

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

    var connecterObj = require('./connecter/' + protocol + '/');
    var connecter = new connecterObj({
        hostname : hostname,
        port : port,
        account : account,
        password : passwd,
        database : database
    });

    if(!this.cluster[clusterName]) {
        this.cluster[clusterName] = [];
    }

    this.cluster[clusterName].push(connecter);
}

function set(key, value, cb, clusterName) {
    if(!clusterName) {
        clusterName = 'default';
    }

    var cluster = this.cluster[clusterName];
    var hash = XXHash.hash(new Buffer(key), 0x654C6162);
    cluster[hash%cluster.length].set(key, value, cb);
}

function get(key, cb, clusterName) {
    if(!clusterName) {
        clusterName = 'default';
    }

    var cluster = this.cluster[clusterName];
    var hash = XXHash.hash(new Buffer(key), 0x654C6162);
    cluster[hash%cluster.length].get(key, cb);
}
