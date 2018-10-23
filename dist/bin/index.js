const program = require("commander");
const { version } = require("../package");

program
.version('0.0.1')
.usage('<command> [options]')
.command('init <project-name>', '初始化 fake portal')
.parse(process.argv);
