function initManagerModule(ctx) {
    this.setSkin(__dirname + "/templates");

    var assets = ctx.getSaram().modules.get('assets');
    assets.addFile('/assets/test', __dirname + '/templates/weld.html');
    assets.addDir('/assets/skin/test/', __dirname + '/templates/assets/');
}

module.exports = initManagerModule;