var Context = require('../context/index.js');
var EventRequestBody = require('./requestbody.js');

function EventContext(saram, event, data) {
    Context.apply(this, [saram]);

    this.req.body = new EventRequestBody(this, data);
}

EventContext.prototype.__proto__ = Context.prototype;
module.exports = EventContext;
