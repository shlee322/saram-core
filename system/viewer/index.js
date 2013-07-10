exports.Engine = function (action, type) {
    type = type ? type : "json";

    var engine = require('./engine/' + type + "/index.js");
    return new engine(action);
}

exports.Template = function (action, file, type) {
    type = type ? type : "ejs";

    var engine = require('./engine/' + type + "/index.js");
    return new engine(action, file);
}
