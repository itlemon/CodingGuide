# CodingGuide

<p align="center">
  <img src="./docs/.vuepress/public/images/readme.gif" height="300"  alt="CodingGuide"/>
</p>
<p align="center">
  <a href="https://codingguide.cn">CodingGuide</a>
</p>

## 使用教程

基础环境要求：[Node.js v14.18.0+](https://nodejs.org/en/)

第一步：克隆项目

```shell
git clone git@github.com:itlemon/CodingGuide.git
```

第二步：安装依赖

```shell
npm install
```

第三步：本地热部署

```shell
npm run docs:dev
```

访问： [http://localhost:8080](http://localhost:8080) 可以看到本地部署的博客，支持动态修改更新。

第四步：服务器部署

- Linux

使用部署脚本可以完成一键github拉取、打包、部署：

```shell
./deploy.sh
```

Linux 或者 macOS 还可以使用命令：

```shell
git pull
sudo npm install
sudo npm run docs:build
sudo nohup npm run docs:serve &
```

- Windows

Windows用户请使用命令：

```shell
git pull
sudo npm install
sudo npm run docs:build
start npm run docs:serve &
```

服务器部署方式默认端口是`4000`，需要注意的是，使用脚本部署或者`nohup`及`start`来部署，都是后台启动，重新启动的时候需要kill原有的进程，才能生效。

## 版权许可

[License MIT](LICENSE)