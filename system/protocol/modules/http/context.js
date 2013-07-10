var Context = require('../../../context/index.js');
var HttpRequest = require('./request.js');
var HttpResponse = require('./response.js');

function HttpContext (saram, req, res) {
    Context.apply(this, [saram]);

    this.req = new HttpRequest(req);
    this.res = new HttpResponse(res);
}

HttpContext.prototype.__proto__ = Context.prototype;
module.exports = HttpContext;
