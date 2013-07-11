module.exports = {
    get : function (ctx) {
        var file = getPath(ctx.current.module, ctx.req.path);
        ctx.errorTry(!file, Error);
        ctx.res.send(file);
    }
}

function getPath(module, path) {
    var dirs = module._dirs;
    for(var name in dirs) {
        if(path.substring(0, name.length) === name)
            return dirs[name] + "/" + path.substring(name.length);
    }
    return module._content[path];
}