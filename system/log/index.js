var fs = require('fs');

exports.LEVEL = {
    'DEBUG':0,
    'INFO':1,
    'NOTICE':2,
    'WARN':3,
    'ERROR':4
};

var _level = exports.LEVEL.DEBUG;

exports.setLevel = function (ctx, level) {
    _level = level;
}

exports.getLevel = function (ctx) {
    return _level;
}

exports.isView = function (ctx, level) {
    return level >= _level;
}

exports.debug = function (ctx, message, args) {
    fs.appendFile('saram.log', "[Debug] " + message + "\n", function (err){});
}

exports.info = function (ctx, message, args) {
    fs.appendFile('saram.log', "[Info] " + message + "\n", function (err){});
}

exports.notice = function (ctx, message, args) {
    fs.appendFile('saram.log', "[Notice] " + message + "\n", function (err){});
}

exports.warning = function (ctx, message, error, args) {
    fs.appendFile('saram.log', "[Warning] " + message + "\n", function (err){});
}

exports.error = function (ctx, message, error, args) {
    fs.appendFile('saram.log', "[Error] " + message + "\n", function (err){});
}
