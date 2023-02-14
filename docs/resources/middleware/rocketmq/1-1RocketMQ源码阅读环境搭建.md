# 第1节 搭建RocketMQ源码环境

![image-20230212125755344](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212125755344.png)

> 提到消息队列（ Message Queue ），大家都会想到常见的那几种，比如： Kafka、 RabbitMQ、 RocketMQ、 ActiveMQ、 ZeroMQ、 MetaMQ 等，当然还有很多企业内部自研了适用于公司业务的 MQ 系统。作为分布式系统的重要组件， MQ 常用于系统间的解耦，以及削峰填谷、异步处理等场景。我们学习 MQ ，不仅要学会如何去使用，更要深入学习 MQ 的设计思想，以及 MQ 的实现原理。上述常见的 MQ 组件中，笔者推荐大家对Apache 的 RocketMQ 进行深入学习，它是 Java 语言实现，并且经历了“双十一”巨大流量的考验，是一个值得去学习的一个组件。本系列文章采用 RocketMQ 5.0 的版本进行深入的源码研究，感兴趣的朋友可以去 RocketMQ 的 github 仓库中将其 fork 到自己的仓库中进行学习。笔者将 RocketMQ 5.0 的版本的源码下载下来，导入到了自己的仓库中，后续的源码分析注释都将基于该仓库代码，仓库地址：[点击跳转](https://github.com/itlemon/rocketmq-5.0.0)。

## 一、RocketMQ源码结构

本文不再赘述如何去 $fork$ 代码，如何去 $git$ $clone$ 代码，笔者认为多数读者都会这些基本操作，如果正在阅读的您尚未掌握这些技巧，可以去查看一下其他博主的文章，正确把 RocketMQ 源码拉取到本地后再来阅读该文章。 Apache RocketMQ 是一个基于 Java 语言开发的消息中间件，构建工具采用的是常用的 $maven$ ，基本的模块结构如下图所示：

![image-20230212153313072](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212153313072.png)

RocketMQ 的所有模块都在上图进行了展示，笔者隐藏了部分文本文件，可能与你 $git$ $clone$ 下来的代码结构有细微区别。接下来，用下表对上述模块进行功能解释。

|      模块名称      | 功能介绍                                                                                                                                                                                                                                                                  |
|:--------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|      acl       | 访问控制列表（Access Control Lists，ACL）， RocketMQ 权限管理模块                                                                                                                                                                                                                     |
|   **bazel**    | **bazel 是 Google 开源的构建工具，目前广泛用于云计算领域的开源软件（如 Kubernetes）构建， RocketMQ 5.0 引入了 bazel 构建**                                                                                                                                                                                |
|     broker     | RocketMQ 5.0 中，计算与存储实现了分离，Broker主要专注于消息存储                                                                                                                                                                                                                             |
|     client     | MQ 客户端，包括 Producer 和 Consumer                                                                                                                                                                                                                                         |
|     common     | 用于存储 RocketMQ 项目的通用代码和 Model 等                                                                                                                                                                                                                                        |
| **container**  | **RocketMQ 5.0 新引入 BrokerContainer 概念，一个 BrokerContainer 中可以部署多个 Broker，这些 Broker 拥有独立的端口，功能完全独立，并且可以共享同一个节点的资源，引入该模块主要是为了解决 RocketMQ 4.5 之前 Broker 节点挂掉后不能自动切换的问题及 RocketMQ 4.5 之后基于 Raft 协议的 DLedger 实现主从切换的资源冗余使用的问题，且支持 Mater-Slave Broker 交叉部署，提高了 Broker 的可用性** |
| **controller** | **RocketMQ 5.0 引入了 DLedger Controller 架构，解决传统 DLedger 架构的不足**                                                                                                                                                                                                         |
|      dev       | merge_rocketmq_pr.py 脚本，用于处理 RP                                                                                                                                                                                                                                       |
|  distribution  | Client、 Namesrv、 Broker 等启动脚本及打包脚本                                                                                                                                                                                                                                    |
|      docs      | 文档                                                                                                                                                                                                                                                                    |
|    example     | RocketMQ 示例代码，源码分析可以从这里入手                                                                                                                                                                                                                                             |
|     filter     | 过滤器模块，包含 SQL 过滤                                                                                                                                                                                                                                                       |
|    logging     | 日志实现模块                                                                                                                                                                                                                                                                |
|    namesrv     | Namesrv 实现模块                                                                                                                                                                                                                                                          |
| openmessaging  | openmessaging 模块                                                                                                                                                                                                                                                      |
|   **proxy**    | **RocketMQ 5.0 为了更好地拥抱云原生，实现了计算和存储相分离，把计算相关的功能抽象到了 Proxy，协议适配、权限管理、消息管理等，Broker 则专注于存储**                                                                                                                                                                              |
|    remoting    | 基于 Netty 实现的网络通信模块， RocketMQ 各组件之间的通信都依赖它                                                                                                                                                                                                                             |
|    srvutil     | 工具包模块                                                                                                                                                                                                                                                                 |
|     store      | 数据存储模块，例如 Broker 数据                                                                                                                                                                                                                                                   |
|     style      | 代码风格 XML 文件                                                                                                                                                                                                                                                           |
|      test      | RocketMQ 案例测试模块                                                                                                                                                                                                                                                       |
|     tools      | RocketMQ 对外命令行接口、管理类接口等                                                                                                                                                                                                                                               |

上述模块中，加黑的模块是 RocketMQ 5.0 新增的模块，为了更好地拥抱云原生， RocketMQ 5.0 架构上发生了比较大的变化，实现计算存储相分离，并且引入 $bazel$ 进行构建。在高可用方面，RocketMQ 5.0 对传统的基于 DLedger 的高可用进行了改造，同时引入了 BrokerContainer 对等部署方案。

## 二、RocketMQ源码编译

将 RocketMQ 源码导入到 IntelliJ IDEA 中，如下图所示：

![image-20230212165733060](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212165733060.png)

然后进入到 RocketMQ 根目录，在控制台使用命令 `mvn -Dmaven.test.skip=true clean package` 进行编译，当然也可以使用 IntelliJ IDEA 可视化插件进行编译，如下图所示：

![image-20230212170002921](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212170002921.png)

编译成功后如下图所示：

![image-20230212170513837](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212170513837.png)

如果编译过程中出现插件找不到或者部分依赖找不到，可以尝试将 $maven$ 的远程仓库替换成为[阿里云maven仓库](https://developer.aliyun.com/mvn/guide)。

## 三、启动Namesrv和Broker

编译完成之后，可以尝试启动 Namesrv 和 Broker，为了阅读源码方便，笔者不建议去下载 RocketMQ 官方编译打包好的 Namesrv 和 Broker 进行测试，而是直接在 IDEA 中启动 Namesrv 和 Broker，方便后续的代码分析，接下来，我将带着大家一步一步去启动 Namesrv 和 Broker。

### 3.1 启动Namesrv

进入到`namesrv`源代码的`org.apache.rocketmq.namesrv`包中，找到启动类`NamesrvStartup`，然后拷贝它的全路径，进入到启动窗口进行配置（建议先启动一下启动类，然后该窗口的部分参数都会自动填好），如下图所示：

![image-20230212171956297](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212171956297.png)

这里主要需要配置好一个环境变量 `ROCKETMQ_HOME`，可以在计算机的任何位置建一个目录，设置为 `ROCKETMQ_HOME` 的值。目录建立好之后，在 `rocketmq_home` 目录下建立三个目录，分别是 `conf`、 `logs`、 `store`，分别用于存储配置文件，日志以及数据。然后将 `distribution` 模块中 `conf` 目录下的 `broker.conf`、 `logback_broker.xml`、 `logback_namesrv.xml`拷贝到 `rocketmq_home` 下的 `conf` 目录中，并修改部分配置。首先修改 `broker.conf` ，具体内容如下：

```properties
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0
# 添加此项，broker连接到本地的namesrv上
namesrvAddr = 127.0.0.1:9876
deleteWhen = 04
fileReservedTime = 48
# 同步复制，异步刷盘
brokerRole = ASYNC_MASTER
flushDiskType = ASYNC_FLUSH

# 添加以下配置，路径请修改为自己的正确路径
# 配置存储位置
storePathRootDir = /Users/jiangpingping/rocketmq_home/store
# commitlog 存储路径
storePathCommitLog = /Users/jiangpingping/rocketmq_home/store/commitlog
# 消费队列存储路径
storePathConsumeQueue = /Users/jiangpingping/rocketmq_home/store/consumequeue
# 消息索引存储路径
storePathIndex = /Users/jiangpingping/rocketmq_home/store/index
# checkpoint文件存储路径
storeCheckPoint = /Users/jiangpingping/rocketmq_home/store/checkpoint
# abort文件存储路径
abortFile = /Users/jiangpingping/rocketmq_home/store/abort
```

为了将日志也存储到指定的 `rocketmq_home` 下的 logs 目录，还需要修改一下 `logback_broker.xml` 和 `logback_namesrv.xml` 文件，在两个日志中各添加一项配置，在 `<configuration>` 标签下的第一行添加如下配置，用来覆盖系统变量值。

```xml
<!-- 自定义配置，目录需要改成自己的rocketmq_home -->
<property name="user.home" value="/Users/jiangpingping/rocketmq_home"/>
```

配置了上述内容，就可以正常启动 `Namesev` 模块了，其实上述配置也包含了 `Broker` 的相关配置，为了方便，就放在一起进行表述了。注意： `Namesrv` 的默认启动端口是 `9876`。当然，我们也可以修改 `NamesrvStartup` 的源码，让其支持自定义端口，具体可参考：[RocketMQ源码之路（二）NameServer路由中心源码分析](https://itlemon.blog.csdn.net/article/details/108812155)。

### 3.2 启动Broker

配置`Broker`的启动类，添加一个启动参数指定配置文件启动，参数是：

```
-c /Users/jiangpingping/rocketmq_home/conf/broker.conf
```

并指定环境变量 `ROCKETMQ_HOME` ，具体如下图所示：

![image-20230212174420929](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230212174420929.png)

配置完 `Broker` 后就可以正常启动了，后续的测试注意要先启动 `Namesrv`，后启动 `Broker`，顺序不要乱。

## 四、测试消息生产者和消费者

启动好 `Namesrv` 和 `Broker` 模块以后，进入到 `example` 模块中，找到 `org.apache.rocketmq.example.quickstart` 包，里面已经有了两个类，分别是 `Producer` 和 `Consumer` ，在两个类中分别设置一下 `Namesrv` 地址，如下所示：

```java
// Producer
producer.setNamesrvAddr("127.0.0.1:9876");
// Consumer
consumer.setNamesrvAddr("127.0.0.1:9876");
```

然后分别启动 `Consumer` 和 `Producer` 就可以正常进行消息消费了。

## 五、总结

本文言简意赅，和我以前的文章风格大有不同，以前是面面俱到，全文翔实。原因是这篇文章是帮助大家尽快搭建起源码环境，对于一些基础知识，比如 RocketMQ 的发展史，什么是 `Namesrv`、什么是 `Broker`，这些基础知识大家可以去阅读 RocketMQ 官网文档或者其他博客可以了解到，所以这里就没有过多介绍。接下来，欢迎大家订阅我的 `RocketMQ源码之路` 系列文章，让我们一起去遨游 RocketMQ 源码世界吧！

了解更多干货，欢迎关注我的微信公众号：爪哇论剑（微信号：itlemon）
![微信公众号-爪哇论剑-itlemon](https://img-blog.csdnimg.cn/20190917130526135.jpeg)