module.exports = parse2Screen;

var fs = require("fs");
var Converter = require("../../node_modules/csvtojson/libs/core").Converter;
var _showHelp = require("../util/helpUtil");

var started = false;

function parse2Screen(parsedCmd) {
	var args = parsedCmd.options;
    args.constructResult = false;
    var converter = new Converter(args);
    if (parsedCmd.extra == "") {
        _showHelp();
    } else {
        var path = parsedCmd.extra;
        if (fs.existsSync(path)) {
            var rs = fs.createReadStream(path);
            rs.pipe(converter);
        } else {
            console.log("File not found: " + path);
            process.exit(1);
        }
    }

    process.stdout.write("[");
    
    converter.on("data",function(d){
      if (!started){
        started=true;
      }else{
        process.stdout.write(",");
      }
      process.stdout.write(d);
    });

    converter.on("end",function(){
      	process.stdout.write("]");
    });
}