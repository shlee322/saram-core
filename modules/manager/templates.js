var path = require('path');

module.exports = {
    dir:__dirname,
    actions:{
        main:{ file:"templates/main.html", engine:"raw" },
        modules_main:{ file:"modules/templates/modules.html", engine:"ejs" },
        modules_module_create:{ file:"modules/templates/modules_create.html", engine:"ejs" },
        weld_main:{ file:"templates/weld.html", engine:"ejs" }
    }
}