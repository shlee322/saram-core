var Engine = require('./engine.js');

function Template() {
    Template.apply(this);
}

Template.prototype.__proto__ = Engine.prototype;
module.exports = Template;
