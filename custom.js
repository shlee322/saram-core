module.exports = function (saram) {
    this.module = function(name, mod) {
        mod.getName = function(){return name;}
        if(!mod.actions) {
            mod.actions = {};
        }
        if(!mod.pipes) {
            mod.pipes = [];
        }
        saram.load(mod);
        saram.use(name, name);
    };

    this.get = function (name, path, func) {
        customMethod(saram, name, 'GET', path, func);
    };
    this.post = function (name, path, func) {
        customMethod(saram, name, 'POST', path, func);
    };
    this.put = function (name, path, func) {
        customMethod(saram, name, 'PUT', path, func);
    };
    this.delete = function (name, path, func) {
        customMethod(saram, name, 'DELETE', path, func);
    };
    this.action = function (name, func) {
        customMethod(saram, name, null, null, func);
    };
}

function customMethod(saram, name, method, path, func) {
    var mod = {
        getName:function(){return name;},
        actions:{customAction:func},
        pipes:[{type:method, url:path, action:"customAction"}]
    };
    if(!path) {
        mod.pipes = [];
    }
    saram.load(mod);
    saram.use(name, name);
}