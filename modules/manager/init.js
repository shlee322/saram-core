var Viewer = require('../../system/viewer/index.js');

function initManagerModule(ctx) {
    var saram = ctx.getSaram();

    this.setSkin(__dirname + "/templates");

    var assets = ctx.getSaram().modules.get('assets');
    //assets.addFile('/assets/test', __dirname + '/templates/weld.html');
    //assets.addDir('/assets/skin/test/', __dirname + '/templates/assets/');


    saram.use('elab.layout', ctx.current.module.getMid()+'.layout', {
        viewer:Viewer.Template("main", "layout.html")
    });
    ctx.getSaram().modules.get(ctx.current.module.getMid()+'.layout').setSkin(__dirname + "/templates");

    saram.modules.addReceiver(ctx.current.module.getMid(), 'call.main.before', ctx.current.module.getMid()+'.layout', 'layout');
}

module.exports = initManagerModule;