var UUID_Class = require('saram-core/system/uuid/index.js');
var UUID = new UUID_Class();

describe('UUID', function() {
    it('#Generate', function(done) {
    	UUID.generate(function(uuid) {
    		done(!uuid ? new Error("UUID 생성 실패") : undefined);
    	});
    });
});
