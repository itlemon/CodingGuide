# CodingGuide

<p align="center">
  <img src="./docs/.vuepress/public/images/readme.gif" height="300"  alt="CodingGuide"/>
</p>
<p align="center">
  <a href="https://codingguide.cn">CodingGuide</a>
</p>

## 使用教程

第一步：克隆项目

```shell
git clone git@github.com:itlemon/CodingGuide.git
```

第二步：安装依赖

```shell
yarn install
```

第三步：本地热部署

```shell
yarn dev
```

访问： [http://localhost:8080](http://localhost:8080) 可以看到本地部署的博客，支持动态修改更新。

第四步：服务器部署

:::: code-group
::: code-group-item Linux
```shell
./deploy.sh
```
:::
::: code-group-item Other
```shell
nohup yarn serve &
```
:::
::::

服务器部署方式默认端口是4000

## 版权许可

[License MIT](LICENSE)