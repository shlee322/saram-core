//비동기 데이터 수신 등에 사용
function RequestData () {
}

RequestData.prototype.readKey = function (keys, callback) {
    this.readKeyRoutine(typeof keys == "string" ? [keys] : keys, callback);
}

RequestData.prototype.getValue = function (key, defaultValue) {
}

RequestData.prototype.readKeyRoutine = function (keys, callback) {
    callback();
}

module.exports = RequestData;