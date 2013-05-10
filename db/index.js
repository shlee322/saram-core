var url = require('url');

module.exports = function() {
    return new newDB();
}

function newDB() {
    this.addNode = addNode;

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

    var ndbcObj = require('./ndbc/' + protocol + '/');
    var ndbc = new ndbcObj({
        hostname : hostname,
        port : port,
        account : account,
        password : passwd,
        database : database
    });

    if(!this.cluster[clusterName]) {
        this.cluster[clusterName] = [];
    }

    this.cluster[clusterName].push(ndbc);
}

function table() {
}