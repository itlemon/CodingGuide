# SkyWalking 9.x 快速入门

在 SkyWalking 官网 [下载](https://skywalking.apache.org/downloads/) SkyWalking APM v9.7.0版本以及SkyWalking Java Agent v9.1.0版本，如下图所示：

![image-20240326232806203](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20240326232806203.png)



```shell
# 创建目录
mkdir -p /development/programs/skywalking
cd /development/programs/skywalking

# 下载OAP压缩包
wget https://dlcdn.apache.org/skywalking/9.7.0/apache-skywalking-apm-9.7.0.tar.gz

# 解压OAP压缩包
tar -zxvf apache-skywalking-apm-9.7.0.tar.gz

# 查看解压后的文件
ll apache-skywalking-apm-bin -ls

# 文件介绍
  0 drwxr-xr-x.  2 root root    241 3月  26 23:33 bin  # 执行脚本，例如启动脚本等
  4 drwxr-xr-x. 12 root root   4096 3月  26 23:33 config  # 配置文件夹
  0 drwxr-xr-x.  2 root root     68 3月  26 23:33 config-examples  # 配置案例文件夹
 44 -rw-r--r--.  1 root root  42077 11月 29 05:04 LICENSE  # 许可
  4 drwxr-xr-x.  3 root root   4096 3月  26 23:33 licenses
  4 -rw-r--r--.  1 root root   1605 11月 29 05:04 LICENSE.tpl
 32 -rwxr-xr-x.  1 root root  30503 11月 29 05:04 NOTICE
 16 drwxr-xr-x.  2 root root  12288 11月 29 05:04 oap-libs  # SkyWalking OAP Server
  4 -rw-r--r--.  1 root root   1947 11月 29 05:04 README.txt
  0 drwxr-xr-x.  4 root root     52 3月  26 23:33 tools
  0 drwxr-xr-x.  2 root root     76 3月  26 23:33 webapp  # SkyWalking Web UI
208 -rwxr-xr-x.  1 root root 211241 11月 29 05:04 zipkin-LICENSE
```

启动SkyWalking OAP Server

修改配置配置文件 `apache-skywalking-apm-bin/config/application.yml` 

我们这里使用的是 ElasticSearch 作为存储，所以需要修改 `storage.selector` 为 elasticsearch，并设置正确的 elasticsearch 的地址，对应的修改配置如下所示：

![image-20240326234553841](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20240326234553841.png)

其实这里不去修改配置文件也是可以的，在环境变量中指定 `SW_STORAGE` 和 `SW_STORAGE_ES_CLUSTER_NODES` 即可。由于我的 elasticsearch 和 SkyWalking OAP Server 部署在一起，所以 clusterNodes 就保持默认即可，也就是 localhost:9200 ，读者可以根据服务部署情况进行正确设置即可。

启动命令，进入到apache-skywalking-apm-bin目录下，执行：

bin/oapService.sh

logs/skywalking-oap-server.log

```shell
2024-03-27 23:06:26,520 - com.linecorp.armeria.server.Server - 832 [armeria-boss-http-*:9090] INFO  [] - Serving HTTP at /0:0:0:0:0:0:0:0%0:9090 - http://127.0.0.1:9090/
2024-03-27 23:06:26,577 - com.linecorp.armeria.server.Server - 832 [armeria-boss-http-*:12801] INFO  [] - Serving HTTP at /0:0:0:0:0:0:0:0%0:12801 - http://127.0.0.1:12801/
```

web

```shell
2024-03-27 23:10:29,917 - com.linecorp.armeria.server.Server - 832 [armeria-boss-http-*:8080] INFO  [] - Serving HTTP at /0:0:0:0:0:0:0:0%0:8080 - http://127.0.0.1:8080/
```

