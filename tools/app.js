var saram = require('../index.js');

var saramArgv = {};

var argv = process.argv;
for(var i=2; i<argv.length; i++) {
    var arg = argv[i];

    if(arg == "-c" || arg == "--config") {
        if(i+1 >= argv.length) {
            console.log("필요한 인자가 부족합니다. -c <path>");
            return;
        }
        saramArgv.config = argv[++i];
        continue;
    }
    
    if(arg == "-h" || arg == "-help") {
        console.log("Help");
        console.log("-c <path> : 설정 파일 경로 설정");
        continue;
    }    

    console.log("잘못된 인자 : " + arg);
    console.log("도움말 -h");
    return;
}

if(!saramArgv.config) {
    console.log("-c 인자가 없습니다. saram.xml로 대체됩니다.");
    saramArgv.config = "saram.xml";
}

var server = saram(saramArgv);
server.start(function() {});
