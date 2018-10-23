const initFn = require('./fake-portal-init.js');
const log = require('./log.js');

const [env, cmd, ...argv] = process.argv;

if (argv[0] === 'init') {
    initFn();
}

if (!argv[0] || argv[0] === '--help') {
    console.group('fake-portal cmd list:');
    console.log('init: init fake portal');
    console.log('--help: help info');
    console.groupEnd();
}