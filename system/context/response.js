function Response(ctx) {
}

Response.prototype.send = function (data, header) {
}

Response.prototype.error = function (error, header) {
    throw error;
}


module.exports = Response;
