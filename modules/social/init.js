module.exports = function (ctx) {
    var saram = ctx.getSaram();
    saram.use('elab.list', ctx.current.module.getMid()+'.following', {
        name:ctx.current.module.getMid()+"_following",
        param : [[ctx.current.module.getMid(),'uid']],
        overlap:false
    });
    saram.use('elab.list', ctx.current.module.getMid()+'.follower', {
        name:ctx.current.module.getMid()+"_follower",
        param : [[ctx.current.module.getMid(),'uid']],
        overlap:false
    });

    saram.weld(ctx.current.module.getMid(), ctx.current.module.getMid()+'.following', 'following');
    saram.weld(ctx.current.module.getMid(), ctx.current.module.getMid()+'.follower', 'follower');

    saram.addReceiver(ctx.current.module.getMid()+'.following', 'call.insert.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid()+'.following', 'call.update.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid()+'.following', 'call.delete.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid()+'.follower', 'call.insert.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid()+'.follower', 'call.update.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid()+'.follower', 'call.delete.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid(), 'call.addFollowing.before', null, 'serverOnly');
    saram.addReceiver(ctx.current.module.getMid(), 'call.boxlist.before', null, 'serverOnly');
}
