var Viewer = require('../index.js');

function LayoutViewer(file, engine) {
    if(!engine) {
        engine = "ejs";
    }

    var Engine = require('./engine/' + engine + "/index.js");
    this._engine = new Engine(file);
}

LayoutViewer.prototype.process = function (res, stack, data, cb) {
    if(!data.data) {
        data.data = {};
    }

    if(data.data.content == true) {
        var _this = this;
        Viewer.process(res, stack, function (buf) {
            data.data.content = buf;
            _this.process(res, stack, data, cb);
        });
    }

    this._engine.render(data.data, function(html) {
        cb(html);
    });
}

module.exports = LayoutViewer;