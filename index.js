#!/usr/bin/env node

var commandParser = require("./lib/parsers/command");
var parse2Screen = require("./lib/deploy/screen");
var parse2Server = require("./lib/deploy/server");
var _showHelp = require("./lib/util/helpUtil");

process.stdin.setEncoding('utf8');
var parsedCmd = commandParser();

if (parsedCmd.cmd == "parse") {
    parse2Screen(parsedCmd);
} else if (parsedCmd.cmd == "deploy") {
	//@WIKI do here!!
	parse2Server(parsedCmd);
} else {
    _showHelp();
}