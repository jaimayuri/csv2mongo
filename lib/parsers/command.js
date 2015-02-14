module.exports = commandParser;

var _showHelp = require("../util/helpUtil");

function commandParser() {
    var cmdArr = process.argv;
    cmdArr.shift();
    cmdArr.shift();
    if (cmdArr.length === 0) {
        return {
            "cmd": "parse",
            "options": {},
            "extra": ""
        }
    }
    if (cmdArr.length === 1) {
        var arg = cmdArr.shift();
        if (arg.toLowerCase().indexOf("help") > -1) {
            _showHelp();
        } else if (isOption(arg)) {
            console.log("command cannot be omited");
            _showHelp();
        } else if (arg.toLowerCase() == "parse") {
            return {
                "cmd": "parse",
                "options": {},
                "extra": ""
            }
        } else {
            return {
                "cmd": "parse",
                "options": {},
                "extra": arg
            }
        }
    }
    var cmd = cmdArr.shift();
    var args = {};
    var extra = "";
    while (cmdArr.length) {
        if (cmdArr.length > 1 || isOption(cmdArr[0])) {
            var pair = cmdArr.shift();
            var pairArr = pair.split("=");
            var key = pairArr[0];
            var val = pairArr[1];
            key = key.replace("--", "");
            args[key] = val;
        } else {
            extra = cmdArr.shift();
        }
    }
    return {
        "cmd": cmd,
        "options": args,
        "extra": extra
    }
}

function isOption(arg) {
    return arg.indexOf("=") > -1;
}