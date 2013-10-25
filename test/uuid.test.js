var UUID = require('saram-core/system/uuid/index.js');

describe('UUID', function() {
    it('#Generate', function(done) {
    	UUID.generate(function(uuid) {
    		done(!uuid ? new Error("UUID 생성 실패") : undefined);
    	});
    });
});
