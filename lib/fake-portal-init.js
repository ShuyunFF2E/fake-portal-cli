const { version } = require('../package');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const log = require('./log');

// fake-portal 依赖的本地npm包
// npm uninstall angular angular-resource angular-ui-router ui-router-extras ccms-components oclazyload
const npmPackList = [
    'angular',
    'angular-resource',
    'angular-ui-router',
    'ui-router-extras',
    'ccms-components',
    '@shuyun/ccms-business-components',
    'ccms-customer-view',
    'oclazyload',
    'echarts',
    'gridmanager-angular-1.x',
    'gridmanager-ccms-skin'];

// 版本
const versionLimit = {
    'angular': '1.5.8',
    'angular-resource': '1.5.8',
    'angular-ui-router': '0.2.18'
};

// 生成的文件夹名称
let projectName = 'fake-portal';

// 源文件所在文件夹
const sourcesName = 'sources';

// 源文件所在文件夹
const sourcesPath = path.join(__dirname, `../${sourcesName}`);

// 生成的文件夹路径
const projectPath = projectName;

/**
 * 初始化函数
 * @param isInstall: 是否加载依赖包
 */
const initFn = (isInstall) => {
    log.info(`fake-portal-cli@${version}: ${projectName} 开始创建。。。`);

    // 文件夹未被占用
    if (!fs.existsSync(projectPath)) {
        // 检查依赖文件是否存在
        isInstall && checkNodeModules();
        createDir();
        return;
    }

    // 文件夹被占用
    log.warn(`${projectPath}: 该路径已经存在，请删除后再次执行。`);

    process.stdout.write(`请确认是否删除${projectPath}? (yes/no):`);

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (!chunk) {
            return;
        }

        if (chunk.indexOf('yes') !== -1) {
            rmFiles(projectPath);
            isInstall && checkNodeModules();
            createDir();
        }

        if (chunk.indexOf('no') !== -1) {
            log.error(`执行失败，原因是目录已存在: ${projectPath} \n`);
            process.exit();
        }
    });
};

// 检查依赖文件是否存在
const checkNodeModules = () => {
    let packPath = '';
    let undefinedList = [];
    npmPackList.forEach(pack => {
        packPath = path.join(projectPath, `../node_modules/${pack}`);

        if (!fs.existsSync(packPath)) {
            versionLimit[pack] ? pack = `${pack}@${versionLimit[pack]}` : '';
            undefinedList.push(pack);
        }
    });

    // 当前依赖全部存在
    if (undefinedList.length === 0) {
        log.warn(`提示: portal 依赖的npm已经存在，已跳过安装步骤`);
        return;
    }
    log.warn(`提示: portal 所依赖的npm包进在安装，请等待。。。`);

    console.group('需要安装的npm包:');
    undefinedList.forEach(pack => {
        console.log(`${pack}`);
    });
    console.groupEnd();


    undefinedList.forEach(pack => {
        log.info(`npm install ${pack} --save-dev`);
        child_process.execSync(`npm install ${pack} --save-dev`);
    });
    log.success(`portal 依赖的npm包安装完成\n`);
};

// 创建文件
const createDir = () => {
    try {
        wgetSources();
    } catch (e) {
        log.warn(`wget 命令未能正确执行，使用本地文件进行更新。如想获取最新文件，请安装备wget。`);
        fs.mkdirSync(projectPath);
        copyFiles(sourcesPath, projectPath);
    }
    log.success('fake portal init success');
    process.exit();
};

// 下载远端数据
const wgetSources = () => {
    log.info(`提示: 下载远端最新文件...`);
    const wgetStr = `wget -c https://unpkg.com/fake-portal-cli/${sourcesName}.zip`;
    child_process.execSync(wgetStr);

    log.info(`[copy file] ${sourcesName} => ${projectPath}`);
    child_process.execSync(`unzip ${sourcesName}.zip`);
    child_process.execSync(`mv ${sourcesName} ${projectName}`);
    child_process.execSync(`rm -rf ${sourcesName}.zip`);
    child_process.execSync(`rm -rf ${sourcesName}`);

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