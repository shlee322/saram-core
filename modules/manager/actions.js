var path = require('path');
var fs = require('fs');
var os = require("os");
var querystring = require("querystring");

var actions = {
    main:function(ctx) {
        ctx.res.send({});
    },

    apis:function(ctx) {
        var data = {};
        data.main_menu = [
            { link:'#', text:'Home'},
            { active:true, link:'#', text:'APIs'}
        ]

        data.mid = !ctx.req.query.mid ? 'saram.core' : ctx.req.query.mid;
        data.path = !ctx.req.query.mid ? 'host/' : ctx.req.query.path;
        data.apis = [];
        data.weld = [];

        var module = ctx.getSaram().modules.get(data.mid);
        var bundle = module._bundle;

        getAPI(module, data, bundle.get);
        getAPI(module, data, bundle.post);
        getAPI(module, data, bundle.put);
        getAPI(module, data, bundle.delete);

        for(var welded_i in bundle.weldedBundle) {
            var pipe = bundle.weldedBundle[welded_i].pipe;
            for(var path in bundle.weldedBundle[welded_i].bundles) {
                var weld = bundle.weldedBundle[welded_i].bundles[path];
                var childModule = weld._module;

                var weldData = {};
                weldData.path = pipe.url + path + "/";
                weldData.module = childModule.getMid();
                weldData.query = querystring.stringify({mid:weldData.module, path:weldData.path});
                data.weld.push(weldData);
            }
        }

        ctx.res.send(data);
    }
};

module.exports = actions;

function getAPI(module, data, bundle) {
    var url = data.path.substring(0, data.path.length - 1);
    for(var i in bundle) {
        var pipe = bundle[i];
        if(!pipe.doc)
            continue;

        var doc = module.manager.apis[pipe.doc];
        if(!doc)
            continue;

        var apiData = {
            method:pipe.type.toUpperCase(),
            url:url + pipe.url,
            name:doc.name ? doc.name : pipe.type.toUpperCase() + " " + url + pipe.url,
            info:doc.info ? doc.info : "",
            request:doc.request ? doc.request : {}
        };

        data.apis.push(apiData);
    }
}