var path = require('path');

module.exports = {
    dir:path.resolve(__dirname, 'templates/'),
    actions:{
        main:{ file:"main.html", engine:"raw" },
        modules_main:{ file:"modules.html", engine:"ejs" },
        weld_main:{ file:"weld.html", engine:"ejs" }
    }
}