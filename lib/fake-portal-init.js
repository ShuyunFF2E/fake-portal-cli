const { version } = require('../package');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const log = require('./log');

// fake-portal 依赖的本地npm包
const npmPackList = ['angular', 'angular-resource', 'angular-ui-router', 'ui-router-extras', 'ccms-components', 'oclazyload'];

// 生成的文件夹名称
let projectName = 'fake-portal';

// 源文件所在文件夹
const sourcesName = 'sources';

// 源文件所在文件夹
const sourcesPath = path.join(__dirname, `../${sourcesName}`);

// 生成的文件夹路径
const projectPath = projectName;

// 初始化函数
const initFn = () => {
    log.info(`fake-portal-cli@${version}: ${projectName} 开始创建`);

    // 文件夹未被占用
    if (!fs.existsSync(projectPath)) {
        // 检查依赖文件是否存在
        checkNodeModules();
        return;
    }

    // 文件夹被占用
    log.warn(`${projectPath}: 该路径已经存在，请删除后再次执行。`);

    process.stdout.write('请确认是否删除该文件(yes/no):\n');

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (!chunk) {
            return;
        }

        if (chunk.indexOf('yes') !== -1) {
            rmFiles(projectPath);
            log.success(`remove success: ${projectPath} `);
            checkNodeModules();
            // child_process.exit();
        }

        if (chunk.indexOf('no') !== -1) {
            log.error(`执行失败，原因是目录已存在: ${projectPath} `);
            process.exit(1);
        }
    });
};

// 检查依赖文件是否存在
const checkNodeModules = () => {
    let packPath = '';
    let undefinedList = [];
    npmPackList.forEach(pack => {
        packPath = path.join(__dirname, `../node_modules/${pack}`);
        if (!fs.existsSync(packPath)) {
            undefinedList.push(pack);
        }
    });

    // 当前依赖全部存在
    if (undefinedList.length === 0) {
        createDir();
        child_process.exit();
        return;
    }

    log.warn(`提示: portal 所依赖的npm包未安装完整。`);
    console.group('需要安装的npm包:');
    undefinedList.forEach(pack => {
        console.log(`${pack}`);
    });
    console.groupEnd();

    process.stdout.write('请确认是否自动安装(yes/no):\n');

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (!chunk) {
            return;
        }

        if (chunk.indexOf('yes') !== -1) {
            undefinedList.forEach(pack => {
                log.info(`npm i ${pack}`);
                child_process.execSync(`npm install ${pack}`);
            });
            createDir();
            child_process.exit();
        }

        if (chunk.indexOf('no') !== -1) {
            log.error(`执行失败，原因是以下包未安装: ${undefinedList.join(',')} \n`);
            process.exit(1);
        }
    });

};

// 创建文件
const createDir = () => {
    fs.mkdirSync(projectPath);
    copyFiles(sourcesPath, projectPath);
    log.success('fake portal init success');
    process.exit();
};

// 复制文件
const copyFiles = (sourcesPath, projectPath) => {
    const files = fs.readdirSync(sourcesPath);
    files.forEach((file) => {
        const _sources = path.join(sourcesPath, `/${file}`);
        const _project = path.join(projectPath, `/${file}`);
        log.info(`[copy file]: ${_sources} => ${_project}`);
        const stat = fs.statSync(_sources);
        // 当是目录是，递归复制
        if(stat.isDirectory()) {
            fs.mkdirSync(_project);
            copyFiles(_sources, _project);
            return;
        }
        fs.copyFileSync(_sources, _project);
    });
};

// 删除原有文件夹
const rmFiles = (projectPath) => {
    const files = fs.readdirSync(projectPath);
    if (files.length === 0) {
        fs.rmdirSync(projectPath);
    }
    files.forEach((file) => {
        const _project = path.join(projectPath, `/${file}`);
        log.info(`[delete file]: ${_project}`);
        const stat = fs.statSync(_project);
        // 当是目录是，递归复制
        if(stat.isDirectory()) {
            rmFiles(_project);
            return;
        }
        fs.unlinkSync(_project);
    });

    fs.rmdirSync(projectPath);
};

module.exports = initFn;