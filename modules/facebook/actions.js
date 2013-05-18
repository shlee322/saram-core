var request = require('request');
var querystring = require("querystring");
var XXHash = require('xxhash');

module.exports = {
    auth: function(ctx, step) {
        if(ctx.req.query.code) {
            var url = "https://graph.facebook.com/oauth/access_token?" +
                querystring.stringify({
                    client_id: ctx.current.module.client_id,
                    redirect_uri: ctx.current.module.uri + "/auth",
                    client_secret: ctx.current.module.client_secret,
                    code: ctx.req.query.code
                });
            request(url, function (error, response, body) {
                var data = querystring.parse(body);
                var redirectUrl = ctx.current.module.uri + "/auth?fb_token=" + data.access_token;
                ctx.res.raw.obj.writeHead(200, {"Content-Type": "text/html"});
                ctx.res.raw.obj.end("<meta http-equiv='refresh' content='0;url=" + redirectUrl + "'>");

                step();
            });

            return null;
        }

        if(!ctx.req.query.fb_token) {
            if(ctx.res.raw.type == "http") {
                var redirectUrl = "https://www.facebook.com/dialog/oauth/?" +
                    querystring.stringify({
                        client_id: ctx.current.module.client_id,
                        redirect_uri: ctx.current.module.uri + "/auth",
                        state: ctx.current.module.state
                    });
                ctx.res.raw.obj.writeHead(200, {"Content-Type": "text/html"});
                ctx.res.raw.obj.end("<meta http-equiv='refresh' content='0;url=" + redirectUrl + "'>");
            } else {
                throw ctx.current.module.error('fbtoken.notfound');
            }
            return;
        }

        request("https://graph.facebook.com/me?access_token=" + ctx.req.query.fb_token, function (error, response, body) {
            var obj = JSON.parse(body);
            var id = obj.id;
            if(!id) {
                throw ctx.current.module.error('fbtoken.expired');
            }

            var table = ctx.current.module.name;
            var hash = XXHash.hash(new Buffer(id), 0x654C6162).toString(16);

            ctx.saram.db.query(hash, function (db) {
                db.query("SELECT hex(`uid`) AS `uid` FROM `" + table + "` WHERE `fb_id`=?", [id], function(err, rows) {
                    if(err) {
                        throw err;
                    }
                    if(rows.length < 1)  {
                        ctx.saram.generateUID(function (uid) {
                            ctx.saram.db.query(hash, function (db) {
                                db.query("INSERT INTO `" + table + "`  VALUES(0x" + uid + ", ?);", [id], function(err, rows) {
                                    if(err) {
                                        throw err;
                                    } else {
                                        ctx.saram.call.post(ctx.current.module.userPath + "/signin", null, {uuid:uid}, function(obj) {
                                            ctx.res.send(obj);
                                        });
                                    }

                                    step();
                                });
                            });
                        });
                        return;
                    } else {
                        ctx.saram.call.post(ctx.current.module.userPath + "/signin", null, {uuid:rows[0].uid}, function(obj) {
                            ctx.res.send(obj);
                        });
                    }

                    step();
                });
            });
        });

        return null;
    }
};