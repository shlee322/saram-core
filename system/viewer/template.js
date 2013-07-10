var Engine = require('./engine.js');

function Template() {
    Engine.apply(this);
}

Template.prototype.__proto__ = Engine.prototype;
module.exports = Template;
