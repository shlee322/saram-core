var buffer = require('buffer');
var request = require('request');

module.exports = function (ctx, name, obj) {
    var serverKey = obj.key;

    this.add = function (ctx, next) {
        next(ctx.req.data.getValue("device"));
    };

    this.send = function (ctx, items, next) {
        ctx.req.data.readKey(["data"], function() {
            var body = {
                registration_ids : items,
                data : ctx.req.data.getValue("data")
            };
            body = JSON.stringify(body);
            request({
                url:'https://android.googleapis.com/gcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-length': Buffer.byteLength(body, 'utf8'),
                    'Authorization': 'key=' + serverKey
                },
                body : body
            }, function (error, res, body) {
                if(error) {
                    console.log(error);
                    return;
                }
                if(res.statusCode != 200) {
                    console.log(body);
                    return;
                }
            });
        });
    };
}
