# fake portal 脚手架
## 目录结构
- fake-portal-cli
    - dist `构建后的文件`
    - fake-portal `执行fake-portal init生成的文件`
    - lib `执行所依赖文件`
    - node_modules `外部依赖npm包`
    - sources `执行前的本地文件`
    - .gitignore
    - package.json
    - package-lock.json
    - README.md

## 安装
```
npm install fake-portal-cli -g
```

## 检查依赖，保证项目中存在以下npm包
`
以下的包是portal中需要使用的，你需要做的是确认这些包已经存在于当前项目下，如果不存在需要安装到当前项目下。
`
- angular: `npm i angular --save`
- angular-resource: `npm i angular-resource --save`
- angular-ui-router: `npm i angular-ui-router --save`
- ui-router-extras: `npm i ui-router-extras --save`
- ccms-components: `npm i ccms-components --save`
- oclazyload: `npm i oclazyload --save`

## 生成fake portal
```
fake-portal init
```

## 配置
### 配置路径:
`fake-portal/config.js`

### 配置详情
- name: `模块名称`
- module: `模块值, state('contentManage', ....)`
- isIframe: `是否使用iframe模式`
- url: `指向webpack-dev中的输出的index.html`

### 可能遇到的错误
`
这些问题可能会出现，如果出现按以下方式进行处理。如果遇到了没有展现在下方的错误，请提交issues。
`
#### `TypeError: fs.copyFileSync is not a function`
这是由于node的版本过低导致的，请升级你的的node版本。推荐使用[node升级神器-n](https://www.lovejavascript.com/#!zone/blog/content.html?id=68)

#### 部分js报404错误
这是由于portal的部分依赖在当前项目中未载入，请查看上方项`检查依赖，保证项目中存在以下npm包`