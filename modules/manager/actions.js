var path = require('path');
var fs = require('fs');

var actions = {
    main:function(ctx, next) {
        ctx.res.send({});
    },
    weld_main:function(ctx, next) {
        ctx.res.send({tree:{"/" : {weldNames:["root"], child:generateWeldTree(ctx.saram.pipeBundle)}}});
    },
    get_weld_info:function(ctx, next) {
        var mod = ctx.saram.getModuleObjectByMid(ctx.req.param.mid);
        var test = generateWeldTree(ctx.saram.pipeBundle);
    },
    addModulesDir:function(ctx, next) {
        var dir = ctx.req.query.dir;

        fs.readdir(dir, function(err, files){
            for(var i in files) {
                var modulesDir = path.join(dir, files[i], "index.js");

                var modDir = path.relative(__dirname, modulesDir);
                var mod = getModuleInfo(modDir);
                if(!mod) {
                    continue;
                }
                ctx.current.module.moduleInfos[mod.getName()] = { path:modDir, info:mod };
            }

            next();
        });

        return false;
    }
};

require('./modules/actions.js')(actions);

module.exports = actions;

function getModuleInfo(path) {
    if(path == "index.js") {
        return ;
    }
    var mod = require(path);
    return mod;
}

function generateWeldTree(bundle) {
    var tree = {};
    for(var weld in bundle.weldedBundle) {
        for(var path in bundle.weldedBundle[weld].bundles) {
            var child = bundle.weldedBundle[weld].bundles[path];
            if(!tree[child.moduleObject.getMid()]) {
                tree[child.moduleObject.getMid()] = { weldNames:[], bundle:child };
            }


            var weldNameObject = {};
            for(var name in bundle.weldList) {
                if(bundle.weldList[name].rawPath.path != weld) {
                    continue;
                }
                weldNameObject[name] = true;
            }
            for(var name in weldNameObject) {
                tree[child.moduleObject.getMid()].weldNames.push(name);
            }
        }
    }

    for(var mid in tree) {
        tree[mid].child = generateWeldTree(tree[mid].bundle);
        delete tree[mid].bundle;
    }

    return tree;
}