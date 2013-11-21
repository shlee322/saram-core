exports.process = function (res, stack, cb) {
    var data = stack.pop();
    data.viewer.process(res, stack, data, cb);
}
