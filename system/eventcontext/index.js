var Context = require('../context/index.js');
var Data = require('./data.js');

function EventContext(saram, event, data) {
    Context.apply(this, [saram]);

    this.req.data = new Data(data);
}

EventContext.prototype.__proto__ = Context.prototype;
module.exports = EventContext;
