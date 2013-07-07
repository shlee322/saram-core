var snowflake = require('snowflake-node');

function UUID() {
    this._snow = new snowflake.snowflake;
}

UUID.prototype.generate = function (callback) {
    callback(this._snow.generate());
}

UUID.prototype.sharding = function (uuid, len, callback) {
    callback(this._snow.sharding(uuid, len));
}

module.exports = UUID;