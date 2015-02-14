module.exports = parse2Server;

var fs = require("fs");
var Converter = require("../../node_modules/csvtojson/libs/core").Converter;
var jsonfile = require("../../node_modules/jsonfile");
var rest = require('../../node_modules/restler');
var _showHelp = require("../util/helpUtil");

var started = false;
var config = jsonfile.readFileSync(__dirname + "/../../config.json");

rest.parsers.auto.matchers['application/hal+json'] = function(data, callback) {
  rest.parsers.json.call(this, data, function(err, data) {
    if (!err) {
      data.__parsedBy__ = 'restheart';
    }
    callback(err, data);
  });
};

function parse2Server(parsedCmd) {
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
    
    converter.on("record_parsed", function(d) {
      console.log("Searching for record :" + config.restheart.hostUrl + "/" + d.employee._id);
      rest.get(config.restheart.hostUrl + '/' + d.employee._id, {
        username: config.restheart.username,
        password: config.restheart.password,
        headers: {
          'content-type': 'application/json'
        }
      }).on('fail', function(result) {
          console.info(arguments);
          console.error("Person's record not found, creating new one!");
          // console.log(d.employee);
          rest.postJson(config.restheart.hostUrl, d.employee, {
            username: config.restheart.username,
            password: config.restheart.password,
          }).on('complete', function (result) {
            if (result instanceof Error) {
              console.error('Error:', result.message);
              // this.retry(5000); // try again after 5 sec
            } else {
              console.log("Successfully saved record :)");
              console.info(arguments);
            }
          });
      }).on('success', function (result) {
          console.log("Person's record found!, patching existing one.");
          var docId = d.employee._id;
          delete d.employee._id;
          console.log(d.employee);
          console.log("ETag: "+ result["_etag"]);
          rest.json(config.restheart.hostUrl+"/" + docId, d.employee, {
            username: config.restheart.username,
            password: config.restheart.password,
            headers: {
              'If-Match': result._etag
            }
          }).on('fail', function (result) {
            console.error("Failed to update record!");
            console.log(result);
          }).on("success", function (result) {
              console.log("Successfully updated record :)");
              //console.info(arguments);
          }).on('complete', function (result) {
            if (result instanceof Error) {
              console.log('Error:', result.message);
              // this.retry(5000); // try again after 5 sec
            }
          });
      }).on('complete', function (result) {
        if (result instanceof Error) {
          console.log('Error:', result.message);
          // this.retry(5000); // try again after 5 sec
        }
      });
    });
}