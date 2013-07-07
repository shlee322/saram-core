var request = require('request');
var querystring = require("querystring");
var XXHash = require('xxhash');
var DB = require('../../system/db/index.js');
var Call = require('../../system/call/index.js');
var HttpResponse = require('../../system/protocol/http/response.js');

module.exports = {
    auth: function(ctx) {
        if(ctx.req.query.code) {
            var url = "https://graph.facebook.com/oauth/access_token?" +
                querystring.stringify({
                    client_id: ctx.current.module.config.client_id,
                    redirect_uri: ctx.current.module.config.url + "/auth",
                    client_secret: ctx.current.module.config.client_secret,
                    code: ctx.req.query.code
                });

            request(url, function (error, response, body) {
                var data = querystring.parse(body);
                var redirectUrl = ctx.current.module.config.url + "/auth?fb_token=" + data.access_token;
                ctx.res.raw.obj.writeHead(200, {"Content-Type": "text/html"});
                ctx.res.raw.obj.end("<meta http-equiv='refresh' content='0;url=" + redirectUrl + "'>");

                ctx.current.next();
            });

            ctx.current.authNext = false;
        }

        if(!ctx.req.query.fb_token) {
            ctx.errorTry(!(ctx.res instanceof HttpResponse), Error); //fbtoken.notfound

            var redirectUrl = "https://www.facebook.com/dialog/oauth/?" +
                querystring.stringify({
                    client_id: ctx.current.module.client_id,
                    redirect_uri: ctx.current.module.uri + "/auth",
                    state: ctx.current.module.state
                });
            ctx.res.raw.obj.writeHead(200, {"Content-Type": "text/html"});
            ctx.res.raw.obj.end("<meta http-equiv='refresh' content='0;url=" + redirectUrl + "'>");

            return;
        }

        request("https://graph.facebook.com/me?fields=id&access_token=" + ctx.req.query.fb_token, function (error, response, body) {
            var obj = JSON.parse(body);
            var id = obj.id;

            ctx.errorTry(!id, Error); // 'fbtoken.expired'

            var table = ctx.current.module.config.name;
            var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

            DB.rawQuery(ctx, hash, function (db) {
                db.rawQuery(ctx, "SELECT hex(`uid`) AS `uid` FROM `" + table + "` WHERE `fb_id`=?", [id], function(err, rows) {
                    ctx.errorTry(err, err);

                    if(rows.length < 1)  {
                        ctx.getSaram().uuid.generate(function (uuid) {
                            DB.rawQuery(ctx, hash, function (db) {
                                db.rawQuery(ctx, "INSERT INTO `" + table + "`  VALUES(0x" + uuid + ", ?);", [id], function(err, rows) {
                                    ctx.errorTry(err, err);

                                    Call.post(ctx, ctx.current.module.config.userPath + "/signin", {data:{uuid:uuid}}, function(obj) {
                                        ctx.res.send(obj);
                                        ctx.current.next();
                                    });
                                });
                            });
                        });
                        return;
                    } else {
                        Call.post(ctx, ctx.current.module.config.userPath + "/signin", {data:{uuid:rows[0].uuid}}, function(obj) {
                            ctx.res.send(obj);
                            ctx.current.next();
                        });
                    }
                });
            });
        });

        ctx.current.authNext = false;
    },

    getUUID: function(ctx, step) {
        ctx.errorTry(ctx.req.sender.type != "server", Error); // 'perm.notserver'

        var id = ctx.req.query.fb_id;
        ctx.errorTry(!id, Error); // 'fbid.notfound'

        var table = ctx.current.module.config.name;
        var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

        DB.rawQuery(ctx, hash, function (db) {
            db.rawQuery(ctx, "SELECT hex(`uid`) AS `uid` FROM `" + table + "` WHERE `fb_id`=?", [id], function(err, rows) {
                ctx.errorTry(err, err);
                ctx.errorTry(rows.length < 1, Error); //'user.notfound'

                ctx.res.send({uuid:rows[0].uuid});
            });
        });
    }
};