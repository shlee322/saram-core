module.exports = function (arg){
    if(!(arg instanceof Object))
        arg = {};
    checkObject(arg);
    return arg;
}

function checkObject(arg) {
    check(arg, 'config', [String], 'saram.xml');
    check(arg, 'manager', [String], null);
}

function check(arg, key, type, value){
    if(!arg[key])
        arg[key] = value;
}
