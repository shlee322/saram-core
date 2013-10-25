var request = require('request');
var JsonViewer = require('saram-core/system/viewer/json/index.js');
var EjsViewer = require('saram-core/system/viewer/layout/engine/ejs/index.js');

describe('Viewer', function() {
    describe('Json Viewer', function() {
        it('View', function(done) {
            JsonViewer.process(null, [], {data:{test:1234}}, function (data) {
                done(!data ? new Error("Json Viewer Error") : undefined);
            })
        });
    });

    describe('EJS Viewer', function() {
        var viewer = new EjsViewer(__dirname + 'test.ejs');

        it('View', function(done) {
            viewer.render({test:1234}, function(html){
                done(html!="1234" ? new Error("EJS Viewer Error") : undefined);
            });
        });
    });
});