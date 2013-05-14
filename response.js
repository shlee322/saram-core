var path = require('path');
var fs = require('fs');

module.exports = {
    setHttpResponse: setHttpResponse,
    setServerResponse: setServerResponse
};

function setHttpResponse(ctx, res) {
    var response = {};
    response.raw = {};
    response.raw.type = "http";
    response.raw.obj = res;

    response.info = function (obj) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(obj));
    };

    response.send = response.info;

    if(ctx.req.type == "view") {
        response.send = function (obj) {
            if(!ctx.current.moduleContent.templates) {
                response.info(obj);
                return;
            }

            var template = ctx.current.moduleContent.templates.actions[ctx.current.action];
            if(!template) {
                response.info(obj);
                return;
            }

            if(!template.viewer) {
                var file = path.resolve(ctx.current.moduleContent.templates.dir, template.file);
                fs.readFile(file, 'utf8', function (err, data) {
                    if(!template.engine || template.engine == "jade") {
                        var jade = require('jade');
                        template.viewer = jade.compile(data);
                    } else if(template.engine == "ejs") {
                        var ejs = require('ejs');
                        template.viewer = ejs.compile(data);
                    } else if(template.engine == "raw") {
                        template.viewer = function(obj) { return data };
                    }
                    response.send(obj);
                });
            } else {
                var html = template.viewer(obj);
                res.writeHead(200);
                res.end(html);
            }
        };
    }

    response.error = function (error, code) {
        if(!code) {
            code = 500;
        }

        response.info({error:error});

        //에러 처리
    };

    ctx.setResponse(response);
}

function setServerResponse(ctx, callback) {
    var response = {};
    response.raw = {};
    response.raw.type = "server";
    response.raw.obj = callback;

    response.info = function (obj) {
        callback(obj);
    };

    response.send = response.info;

    response.error = function (error, code) {
        if(!code) {
            code = 500;
        }

        //에러 처리
    };

    ctx.setResponse(response);
}