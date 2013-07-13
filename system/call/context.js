var Context = require('../context/index.js');
var CallRequest = require('./request.js');
var CallResponse = require('./response.js');

function CallContext (pernet, method, path, data, callback) {
    Context.apply(this, [pernet.getSaram()]);
    pernet.setChild(this);

    this.req = new CallRequest(this, method, path, data);
    this.res = new CallResponse(this, pernet, callback);
}

CallContext.prototype.__proto__ = Context.prototype;
module.exports = CallContext;
