var moduleSys = require('../../module/');

module.exports = moduleSys.init({
    getName:function(){
        return "saram.core";
    },
    actions:require('./actions.js'),
    pipes:[{type:"WELD", name:"root", url:"/", action:"root"}]
});
