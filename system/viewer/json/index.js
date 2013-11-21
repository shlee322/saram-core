function JsonViewer() {
}

JsonViewer.prototype.process = function (res, stack, data, cb) {
    var root = data.data;
    root._stack = [];
    for(var i=0; i<stack.length; i++) {
        root._stack[i] = { module:stack[i].module.getMid(), data : stack[i].data };
    }
    cb(JSON.stringify(root));
}

module.exports = new JsonViewer();
