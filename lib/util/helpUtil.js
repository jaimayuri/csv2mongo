module.exports = _showHelp;

function _showHelp() {
    console.log("Usage: csvtojson <command> [<options>] [filepath] ");
    console.log("");
    console.log("Commands: ");
    console.log("   parse: Parse a csv file to json");
    console.log("   deploy: Deploy parsed csv to server");
    console.log("");
    console.log("Options: ");
    console.log("   --delimiter: delimiter to separate columns. default comma (,). e.g. --delimiter=#");
    console.log("   --quote: quote surrounding a column content containing delimiters. default double quote (\"). e.g. --quote=# ");
    process.exit(0);
}