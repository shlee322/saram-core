var Log = require('saram-core/system/log/index.js');

describe('Log', function() {
    it('#Debug', function() {
    	Log.debug(null, "Debug Log");
    });

    it('#Info', function() {
    	Log.info(null, "Info Log");
    });

    it('#Warning', function() {
    	Log.warning(null, "Warning Log");
    });

    it('#Error', function() {
    	Log.error(null, "Error Log");
    });
});
