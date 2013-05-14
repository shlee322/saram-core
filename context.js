var domain = require('domain');

module.exports = function(saram, req, pipeline) {
    var _this = this;

    this.saram = saram;
    this.req = req;
    this.res = {};
    this.pipeline = pipeline;

    //HEX값만
    this.param = {
        _data : {},
        set: function(mid, key, value) {
            if(!value.match(/^[0-9A-Fa-f]+$/)) {
                console.log("Error HEX - mid:" + mid + " key:" + key + " value:" + value);
                return;
            }

            if(!_this.param._data[mid]) {
                _this.param._data[mid] = {};
            }
            _this.param._data[mid][key] = value;
        },
        get: function(mid, key) {
            if(!_this.param._data[mid]) {
                return;
            }
            return _this.param._data[mid][key];
        },
        getList : function() {
            return _this.param._data;
        }
    };
    this.perm = {read:true, write:true};
    this.current = {};

    this.setResponse = function (res) {
        this.res = res;
    }
}