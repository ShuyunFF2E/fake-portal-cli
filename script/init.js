const fs = require('fs');
const path = require('path');
const log = require('./log');

// 源文件所在文件夹
const sourcesName = 'sources';

// 生成的文件夹名称
const projectName = 'fake-portal';

// 源文件所在文件夹
const sourcesPath = path.join(__dirname, `../${sourcesName}`);

// 生成的文件夹路径
const projectPath = path.join(__dirname, `../${projectName}`);

// 创建文件夹
const runCopy = () => {
    log.info(`${projectName} 开始创建`);
    // 校验文件夹是否被占用
    if (fs.existsSync(projectPath)) {
        log.warn(`${projectPath}: 该路径已经存在，请手动删除后再次执行。`);
        return;
    }

    fs.mkdirSync(projectPath);
    copyFiles(sourcesPath, projectPath);
    log.success(`${projectName} 创建成功`);
};
const copyFiles = (sourcesPath, projectPath) => {
    const files = fs.readdirSync(sourcesPath);
    files.forEach((file) => {
        const _sources = path.join(sourcesPath, `/${file}`);
        const _project = path.join(projectPath, `/${file}`);
        log.info(`${_sources} => ${_project}`);
        const stat = fs.statSync(_sources);
        // 当是目录是，递归复制
        if(stat.isDirectory()) {
            fs.mkdirSync(_project);
            copyFiles(_sources, _project);
            isOk = false;
            return;
        }
        fs.copyFileSync(_sources, _project);
    });
};

runCopy();
