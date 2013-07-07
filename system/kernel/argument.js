module.exports = function (arg){
    if(!(arg instanceof Object))
        arg = {};
    checkObject(arg);
    return arg;
}

function checkObject(arg) {
    check(arg, 'db', [String], 'db.json');
    check(arg, 'node', [String], 'node.json');
    check(arg, 'cluster', [String], 'cluster.json');
}

function check(arg, key, type, value){
    if(!arg[key])
        arg[key] = value;
}