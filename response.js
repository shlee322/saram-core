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
    response.raw.obj.responseCode = 200;

    response.info = function (obj) {
        res.writeHead(response.raw.obj.responseCode, {"Server":"saram.elab.kr/0.0.1", "Content-Type": "application/json; charset=utf-8"});
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
                res.writeHead(response.raw.obj.responseCode, {"Server":"saram.elab.kr/0.0.1"});
                res.end(html);
            }
        };
    }

    response.error = function (error) {
        if(response.raw.type == "http") {
            response.raw.obj.responseCode = (error.object && error.object.httpCode) ? error.object.httpCode : 500;
        }

        response.info({error:error});
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
        callback({error:error});
    };

    ctx.setResponse(response);
}