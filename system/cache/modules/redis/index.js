var redis = require("redis");

module.exports = function(obj) {
    this.client = redis.createClient(obj.port, obj.hostname, obj.options ? obj.options : {});
    //TODO : 비밀번호 인증 기능
    this.set = set;
    this.get = get;
}

function set(key, value, cb) {
    if(!cb) {
        cb = function(){};
    }
    this.client.set(key, value, cb);
}

function get(key, cb) {
    var cb2 = function(err, value) {};
    if(cb) {
        cb2 = function(err, value) { cb(value) };
    }
    this.client.get(key, cb2);
}
