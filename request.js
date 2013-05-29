var url = require('url');
var querystring = require('querystring');
var response = require('./response.js');
var call = require('./call.js');
var context = require('./context.js');

module.exports = {
    httpRequest: httpRequest,
    serverRequest: serverRequest,
    directRequest: directRequest,
    request: request
};

/**
 * Http 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param req node.js HTTP Request Object
 * @param res node.js HTTP Response Object
 */
function httpRequest(saram, req, res) {
    var method = req.method.toLowerCase();
    if(method != "get" && method != "post" && method != "put" && method != "delete") {
        return;
    }
    req.sender = {type:"http"};
    req.url = url.parse(req.url, true);
    req.query = req.url.query;
    req.path = req.url.pathname;
    req.type = "data";
    req.body = "";

    var path = req.path;
    if(path.match(/.view$/)) {
        path = path.substring(0, path.length - 5);
        req.type = "view";
    }

    var pipeline = saram.pipeBundle.getPipeline(req.method, path);

    var ctx = new context(saram, req, pipeline);
    response.setHttpResponse(ctx, res);

    //404 Error
    if(!pipeline.found) {
        ctx.res.error({message:"페이지가 존재하지 않습니다.", module:{name:"saram.core", mid:""}, code:"page.notfound", object:{httpCode:404}});
        console.log(req.path);
        return;
    }

    var redirect = pipeline.pipeline[pipeline.pipeline.length - 1].pipe.redirect;
    if(redirect) {
        if(redirect.substring(0,1)=="/") {
            redirect = redirect.substring(1);
        }
        req.url.pathname += redirect;
        var redirectUrl = "http://" + req.headers.host + url.format(req.url);

        res.writeHead(301, {Location:redirectUrl});
        res.end();

        return;
    }

    //차후 용량 체크등등
    req.on('data', function (chunk) {
        req.body += chunk;
    });

    req.on('end', function () {
        //차후 막 종류에 따라 하던지..
        req.body = querystring.parse(req.body);
        request(saram, ctx);
    });
}

/**
 * Server 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param method 요청 메소드
 * @param path 요청 경로
 * @param query 요청 쿼리
 * @param data 요청 데이터
 * @param callback 콜백 함수
 */
function serverRequest(saram, method, path, query, data, callback) {
    var req = {};
    req.sender = {type:"server", name:"local", direct:false};
    req.method = method;
    req.query = query;
    req.path = path;
    req.body = data;
    if(!req.method) {
        req.method = "GET";
    }
    if(!req.query) {
        req.query = {};
    }
    if(!req.body) {
        req.body = {};
    }

    var pipeline = saram.pipeBundle.getPipeline(req.method, req.path);
    //404 Error
    if(!pipeline.found) {
        callback(null);
        return;
    }

    var ctx = new context(saram, req, pipeline);
    response.setServerResponse(ctx, callback);
    request(saram, ctx);
}

function directRequest(saram, moduleContent, moduleObject, actionName, query, data, callback) {
    if(!query) {
        query = {};
    }

    if(!data) {
        data = {};
    }

    var req = {};
    req.sender = {type:"server", name:"local", direct:true};
    req.method = "GET";
    req.query = query;
    req.path = actionName;
    req.data = data;

    var ctx = new context(saram, req, []);

    ctx.run(function(){
        call.callAction(moduleContent, moduleObject, actionName, ctx, function(){}); //차후 콜백처리
    });
}

/**
 * 각 요청을 처리하는 함수
 * @param saram Saram 객체
 * @param ctx Context
 * @returns {*}
 */
function request(saram, ctx) {
    var nowPipe = ctx.pipeline.pipeline.shift();
    if(!nowPipe) {
        return;
    }

    if(!nowPipe.moduleObject) {
        return request(saram, ctx);
    }

    ctx.mObj = nowPipe.moduleObject.obj;
    var actionName = nowPipe.pipe.action;

    //파라미터
    ctx.req.param = {};
    for(var index in nowPipe.match) {
        if(!index.match(/^[0-9]+$/)) {
            continue;
        }
        var index = Number(index);
        if(index == 0) {
            continue;
        }

        ctx.req.param[nowPipe.pipe.rawPath.param[index-1]] = nowPipe.match[index];
    }

    ctx.run(function(){
        call.callAction(nowPipe.moduleContent, nowPipe.moduleObject, actionName, ctx, function(){request(saram, ctx);});
    });
}