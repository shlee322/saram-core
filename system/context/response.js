function Response() {
}

Response.prototype.error = function (error) {
    throw error;
}

Response.prototype.send = function (obj) {
}

module.exports = Response;