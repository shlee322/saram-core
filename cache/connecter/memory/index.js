var store = require("memory-store"); //두개 이상 로드 처리가 좀.

module.exports = function(obj) {
    this.set = set;
    this.get = get;
}

function set(key, value, cb) {
    if(!cb) {
        cb = function(){};
    }
    store.set(key, value, cb);
}

function get(key, cb) {
    var cb2 = function(){};
    if(cb) {
        cb2 = function(a, value) { cb(value); };
    }
    store.get(key, cb2);
}