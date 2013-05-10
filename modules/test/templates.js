var path = require('path');

module.exports = {
    dir:path.resolve(__dirname, 'templates/'),
    actions:{
        get_test:{
            file:"test.jade"
        }
    }
}