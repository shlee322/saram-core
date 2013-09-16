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

exports.debug = function (ctx, message) {
    fs.appendFile('saram.log', "[Debug] " + message + "\n", function (err){});
}

exports.info = function (ctx, message) {
    fs.appendFile('saram.log', "[Info] " + message + "\n", function (err){});
}

exports.notice = function (ctx, message) {
    fs.appendFile('saram.log', "[Notice] " + message + "\n", function (err){});
}

exports.warning = function (ctx, message, error) {
    fs.appendFile('saram.log', "[Warning] " + message + "\n", function (err){});
}

exports.error = function (ctx, message, error) {
    fs.appendFile('saram.log', "[Error] " + message + "\n", function (err){});
}

exports.critical = function (ctx, message, error) {
    fs.appendFile('saram.log', "[Critical] " + message + "\n", function (err){});
}

exports.alert = function (ctx, message, error) {
    fs.appendFile('saram.log', "[Alert] " + message + "\n", function (err){});
}

exports.emergency = function (ctx, message, error) {
    fs.appendFile('saram.log', "[Emergency] " + message + "\n", function (err){});
}
