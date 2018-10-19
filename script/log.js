const chalk = require('chalk');
const
    success = chalk.bold.green,
    info = chalk.bold.grey,
    error = chalk.bold.red,
    warn = chalk.bold.yellow;

const log = (...message) => {
    console.log(...message);
};

Object.assign(log, {
    success(...message) {
        console.log(success(...message));
    },
    info(...message) {
        console.log(info(...message));
    },
    error(...message) {
        console.log(error(...message));
    },
    warn(...message) {
        console.log(warn(...message));
    }
});

module.exports = log;
