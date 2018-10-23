# fake portal 脚手架

## 安装
```
npm install fake-portal-cli -g
```

## 检查依赖，保证项目中存在以下npm包
- angular
- angular-resource
- angular-ui-router
- ui-router-extras
- ccms-components
- oclazyload

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