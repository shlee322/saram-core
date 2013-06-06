module.exports = function (ctx) {
    ctx.saram.use('elab.list', ctx.current.module.getMid()+'.following', {
        name:ctx.current.module.getMid()+"_following",
        param : [[ctx.current.module.getMid(),'uid']],
        overlap:false
    });
    ctx.saram.use('elab.list', ctx.current.module.getMid()+'.follower', {
        name:ctx.current.module.getMid()+"_follower",
        param : [[ctx.current.module.getMid(),'uid']],
        overlap:false
    });

    ctx.saram.weld(ctx.current.module.getMid(), ctx.current.module.getMid()+'.following', 'following');
    ctx.saram.weld(ctx.current.module.getMid(), ctx.current.module.getMid()+'.follower', 'follower');

    ctx.saram.addReceiver(ctx.current.module.getMid()+'.following', 'call.insert.before', null, 'serverOnly');
    ctx.saram.addReceiver(ctx.current.module.getMid()+'.follower', 'call.insert.before', null, 'serverOnly');
    ctx.saram.addReceiver(ctx.current.module.getMid(), 'call.addFollowing.before', null, 'serverOnly');
    ctx.saram.addReceiver(ctx.current.module.getMid(), 'call.boxlist.before', null, 'serverOnly');
}