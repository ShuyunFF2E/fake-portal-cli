const { version } = require('../package');
const fs = require('fs');
const path = require('path');
const log = require('./log');

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
    log.info(`${projectName} 开始创建`);
    console.log(projectPath);
    // 校验文件夹是否被占用
    if (fs.existsSync(projectPath)) {
        log.warn(`${projectPath}: 该路径已经存在，请手动删除后再次执行。`);
        process.stdout.write('请确认是否删除该文件(yes/no):\n');

        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (!chunk) {
                return;
            }

            if (chunk.indexOf('yes') !== -1) {
                rmFiles(projectPath);
                log.success(`remove success: ${projectPath} `);
                createDir();
                process.exit();
            }

            if (chunk.indexOf('no') !== -1) {
                log.warn(`执行失败，原因是目录已存在: ${projectPath} `);
                process.exit();
            }
        });
    } else {
        createDir();
    }
};

const createDir = () => {
    fs.mkdirSync(projectPath);
    copyFiles(sourcesPath, projectPath);
    log.success('fake portal init success');
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