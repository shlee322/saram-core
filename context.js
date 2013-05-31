var domain = require('domain');

module.exports = function(saram, req, pipeline) {
    var _this = this;

    this.saram = saram;
    this.req = req;
    this.res = {};
    this.pipeline = pipeline;

    this.domain = domain.create();
    this.domain.on('error', function(er) {
        _this.run(function(){
            if(er.type != "saram.error") {
                _this.res.error({message:er.message, module:{name:"saram.core", mid:""}, code:'core.error.uncaughtException', stack:er.stack});
            } else {
                _this.res.error({message:er.errorMessage, module:{name:er.errorModule.getModuleName(), mid:er.errorModule.getMid()}, code:er.errorCode, object:er.errorObject, stack:er.stack});
            }
        });
    });

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

    this.run = function(func) {
        _this.domain.run(func);
    }

    this.wait = function(funcArray, callback) {
    }

    this.db = {
        query : function (hash, func, clusterName) {
            return saram.db.query(hash, func, clusterName, _this);
        }
    }
}