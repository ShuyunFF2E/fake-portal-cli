const initFn = require('./fake-portal-init.js');
const log = require('./log.js');

const [env, cmd, ...argv] = process.argv;
if (argv.indexOf('init') !== -1) {
    initFn(argv.indexOf('-i') !== -1);
    return;
}

if (!argv[0] || argv.indexOf('-help') !== -1) {
    console.group('fake-portal cmd list:');
    console.log('init: 创建fake portal文件');
    console.log('init -i: 创建fake portal文件时，对未加载的依赖项进行即时加载。');
    console.log('-help: 参数列表');
    console.groupEnd();
    return;
}
log.error('fake-portal: 命令不存在，请尝试 fake-portal -help进行查看');