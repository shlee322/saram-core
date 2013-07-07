var url = require('url');
var EventContext = require("../eventcontext/index.js");
var Error = require("../error/index.js");

function Cluster(saram) {
    this._saram = saram;
    this._cluster = {};

    this.EVENT_ADD_NODE = "saram.core.cluster.addNode";
}

Cluster.prototype.addNode = function(node, type) {
    var ctx = new EventContext(this._saram, this.EVENT_ADD_NODE);

    type = type ? type : "default";

    var nodeUrl = url.parse(node);
    if(!nodeUrl.protocol)
        throw new Error(ctx);

    var node = this.connectNode(ctx, nodeUrl);
    ctx.errorTry(!node, Error);

    if(!this._cluster[type])
        this._cluster[type] = [];

    this._cluster[type].push(node);
}

Cluster.prototype.connectNode = function (ctx, nodeUrl) {
    return null;
}

Cluster.prototype.getCluster = function (type) {
    type = type ? type : "default";
    return this._cluster[type];
}

module.exports = Cluster;