# 第1节 NameServer的启动原理

![image-20230214231618529](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/image-20230214231618529.png)

> 一般了解 RocketMQ 的读者都知道，NameServer 是 RocketMQ 的组织协调者，是 RocketMQ 对外提供服务的“大脑”。NameServer 提供了路由管理，服务注册与服务发现等机制，是保证消息正确地从生产者到消费者的“指挥官”。那么，生产者生产的消息是如何正确地被消费者消费的呢？Broker 的宕机是如何被生产者和消费者感知的呢？RocketMQ 对外提供服务的可靠性是如何保障的呢？带着这几个问题，我们一起去深入了解RocketMQ NameServer 的设计原理及实现吧！文中的代码仓库地址：[点击跳转](https://github.com/itlemon/rocketmq-5.0.0)。

## 一、NameServer的基本原理

我们熟知的几种常见的消息队列组件，比如 Kafka，ActiveMQ，RabbitMQ 等，都是一种基于主题的发布订阅机制，RocketMQ 也正是基于这种机制实现的消息服务。消息生产者（Producer）将生产好的消息发布到某个主题，该主题下的消息在消息服务器（Broker）中进行传送或存储，由消费者（Consumer）进行订阅主题，从消息服务器中获取到消息后进行消费。

消费者获取消息的方式通常有两种，一种是主动去消息服务器拉取消息（Pull Message），另外一种是由消息服务器推送消息（Push Message）给消费者。这种主题的发布订阅机制应用到分布式系统中，成功解耦了生产者和消费者。既然是分布式系统，那么常常存在分布式系统问题，比如某个消息服务器宕机了，生产者是如何感知这台消息服务器宕机了，从而避免将消息发送到这台消息服务器上，消费者是如何感知这台消息服务器宕机了，从而避免从这台消息服务器上拉取消息的呢？且这台宕机的消息服务器是如何从消息服务器实例列表中被剔除的呢？这一切都将归功于 NameServer，它的诞生让动态感知、动态剔除、负载均衡成为可能。

下图是 RocketMQ 常见的物理部署图（图片来源：百度图库），采用的部署方式2m-2s（2Master，2Slave），这个部署结构在 RocketMQ 4.x 中也是常用的，本文暂时将不会去过多介绍 RocketMQ 5.0 的新部署结构，后续将有专门的文章去阐述。本小节将根据此图阐述 RocketMQ 基本的流程原理，后面的小节将深入源码中，从源码中来验证基本流程原理。

![](https://img-blog.csdnimg.cn/20201017102633155.png)

文章一开始就说道，NameServer 是整个 RocketMQ 消息服务系统的“大脑”，是指挥消息正确发送、消费的“指挥官”，那么他是如何完成这样完美的指挥任务的呢？

NameServer 被设计为一种无状态的服务注册发现中心，在 NameServer 集群中，各个 NameServer 之间是无感知，无通信的独立节点，任何一个 NameServer 节点挂掉，都不影响整体的消息服务。

Broker 在启动的时候，会向指定的 NameServer 列表中的每个 NameServer 注册，发送自身的元信息到每个 NameServer 中，这些元信息包含但不限于 BrokerName，BrokerAddress，Broker 端口，集群信息，Topic 等信息，这些元信息将保存在 NameServer 的路由信息管理器（RouteInfoManager）中。

当消息生产者在将生产的消息发送出去之前，会从 NameServer 中拉取 Broker 的信息列表，然后通过负载均衡算法从中选择一个 Broker 服务器将消息发送出去。当消息消费者要消费消息之前，也会去 NameServer 中拉取 Broker 的信息列表，从而从 Broker 中获取可消费的消息。

Broker 在首次启动会向 NameServer 注册元信息，启动后也会定期向 NameServer 发送心跳，这个周期默认是 $30$ 秒，当然这个周期可以自定义，支持范围是 $10$ 秒到 $60$ 秒之间，每次心跳发送的数据包都是该 Broker 的元数据信息。

NameServer 也有自动检测能力，NameServer 启动后会注册一个定时任务线程池，默认每隔 $5$ 秒（RocketMQ 4.x 默认是 $10$ 秒）会自动扫描 Broker 列表，对于不再存活的 Broker，将做剔除处理。这动态维护路由信息的能力，并不包含动态通知消息生产者，也就是说生产者并不会及时感知到非存活状态 Broker 被剔除，但是这并不影响消息的正确发送，因为生产者自身提供有容错机制来保证消息的正常发送。

消费者与 NameServer 没有保持长连接，而是每 $30$ 秒从 NameServer 获取所有 Topic 的信息列表，如果某个时刻某个 Broker 宕机，消费者可能需要 $30$ 秒才能知道这个宕机的 Broker 是哪一个，当然这个值也是可以在配置文件中配置的，可根据实际业务来配置该值。消费者在感知 Broker 存活这一块，有自己的机制，比如每 $30$ 秒向 Broker 发送心跳，且 Broker 每 $10$ 秒会检测与消费者的连接情况，若某个连接 $2$ 分钟内（当前时间与最后更新时间差值超过 $2$ 分钟)没有发送心跳数据，则关闭连接，并向该消费者分组的所有消费者发出通知，分组内消费者重新分配队列继续消费。

## 二、NameServer的启动流程原理

在《[RocketMQ源码之路（一）搭建RocketMQ源码环境](1-2RocketMQ源码阅读环境搭建.md)》中，我们了解了如何使用 IDE 启动 NameServer，那么本小节将和大家一起探讨 NameServer 的启动流程原理，我们将从 NameServer 的启动类 NamesrvStartup 开始，和大家一起来阅读 NameServer 的启动源码，帮助大家理解 NameServer 的启动流程。

NameServer 的启动类 NamesrvStartup 的 main 方法（`org.apache.rocketmq.namesrv.NamesrvStartup#main`）如下所示：

```java
public class NamesrvStartup {

    private static InternalLogger log;

    /**
     * 解析命令行参数和配置文件参数，装配到该属性中进行存储，它存储全部的配置k-v，包含-c指定的启动文件和-p打印出来的变量
     */
    private static Properties properties = null;

    /**
     * NameServer配置项：从properties中解析出来的全部NameServer配置
     */
    private static NamesrvConfig namesrvConfig = null;

    /**
     * NettyServer的配置项：从properties中解析出来的全部NameServer RPC服务端启动配置
     */
    private static NettyServerConfig nettyServerConfig = null;

    /**
     * NettyClient的配置项：从properties中解析出来的全部NameServer RPC客户端启动配置
     */
    private static NettyClientConfig nettyClientConfig = null;

    /**
     * DledgerController的配置项：从properties中解析出来的全部Controller需要的启动配置
     */
    private static ControllerConfig controllerConfig = null;

    public static void main(String[] args) {
        // 该方法中是启动NameServer的主要逻辑
        main0(args);

        // 这个方法主要是启动内嵌在NameServer中的DLedger Controller，
        // DLedger Controller可以通过配置的形式在NameServer进程中启动，也可以独立部署。
        // 其主要作用是，用来存储和管理 Broker 的 SyncStateSet 列表，
        // 并在某个 Broker 的 Master Broker 下线或⽹络隔离时，主动发出调度指令来切换 Broker 的 Master。
        // 此部分原理暂时不过多介绍，后续将有专题介绍
        controllerManagerMain();
    }

  	// 后续代码暂时不展开
}
```

main 方法上面的 $5$ 个配置项，都是在启动过程中，从环境变量、配置文件以及启动命令行参数中解析并装配的，具体的配置装配流程在后面的代码中会有解释，这里先把各个配置项含义解释如下：

|      配置项       | 含义                                                         |
| :---------------: | :----------------------------------------------------------- |
|    properties     | 解析命令行参数和配置文件参数，装配到该属性中进行存储，它存储全部的配置 k-v，包含 `-c` 指定的启动文件和 `-p` 打印出来的变量 |
|   namesrvConfig   | NameServer 配置项：从 properties 中解析出来的全部 NameServer 配置 |
| nettyServerConfig | NettyServer 的配置项：从 properties 中解析出来的全部 NameServer RPC 服务端启动配置 |
| nettyClientConfig | NettyClient 的配置项：从 properties 中解析出来的全部 NameServer RPC 客户端启动配置 |
| controllerConfig  | DledgerController 的配置项：从 properties 中解析出来的全部 Controller 需要的启动配置 |

我们看这个 NameServer 的启动代码，主方法 `main(String[] args)` 只有两行，包含 `main0(args)` 和 `controllerManagerMain()` 两个方法，`main0` 逻辑和 4.9.X 基本差不多，它是启动 NameServer 的主要逻辑，相较于 4.9.X，主要新增了 `controllerManagerMain()` 。

`controllerManagerMain()` 方法主要是判断当前 NameServer 是否配置允许内嵌启动一个 DLedger Controller 实例。NameServer 的配置项 namesrvConfig 中有一个配置项 `enableControllerInNamesrv`，它的默认值是 false，当被设置为 true 的时候，那么在启动 NameServer 的过程中，就会启动一个 DLedger Controller 服务。此部分代码我们暂时不过多分析，后续将有专题来分析。我们继续往下看 NameServer 的启动方法 main0。

```java
public static void main0(String[] args) {
    try {
        // 解析命令行参数及配置文件中的配置，并装配到本类的各个属性上
        parseCommandlineAndConfigFile(args);

        // 创建并启动NameServer Controller
        createAndStartNamesrvController();
    } catch (Throwable e) {
        e.printStackTrace();
        System.exit(-1);
    }

}
```

从 main0 方法中可以看出，启动 NameServer 只有两个步骤：

- 第一步是解析命令行参数及配置文件中的配置，并装配到本类的各个属性上
- 第二步是创建并启动 NameServer Controller

### 2.1 解析配置和装配属性

我们一起来看看启动 NameServer 的过程中，是如何将命令行参数、配置文件中的配置解析并装配到属性中的，代码及注释如下：

```java
/**
 * 命令行参数解析及配置文件解析，装配属性
 *
 * @param args 命令行参数
 * @throws Exception 异常
 */
public static void parseCommandlineAndConfigFile(String[] args) throws Exception {

    // 设置当前MQ版本设置为全局环境变量，方便在本项目的任何地方进行获取
    // key为rocketmq.remoting.version，当前版本值为：Version.V5_0_0，数值为413
    System.setProperty(RemotingCommand.REMOTING_VERSION_KEY, Integer.toString(MQVersion.CURRENT_VERSION));
    //PackageConflictDetect.detectFastjson();

    // 构建-h 和 -n 的命令行选项option，并将两个命令行选项加入到options中
    // 发散一下，其实可以在buildCommandlineOptions加一些自定义代码，比如可以设置NameServer的启动端口等
    Options options = ServerUtil.buildCommandlineOptions(new Options());

    // 从命令行参数中解析各个命令行选项，将选项名和选项值加载到CommandLine对象中，
    // 其中本类的buildCommandlineOptions方法，向options中加入了两个选项，分别是configFile和printConfigItem
    // 在解析命令行选项的时候，如果发现命令行选项中包含-h或者--help，那么NameServer是不会启动的，只会打印命令行帮助信息，打印结果如下所示：
    // usage: mqnamesrv [-c <arg>] [-h] [-n <arg>] [-p]
    // -c,--configFile <arg>    Name server config properties file
    // -h,--help                Print help
    // -n,--namesrvAddr <arg>   Name server address list, eg: '192.168.0.1:9876;192.168.0.2:9876'
    // -p,--printConfigItem     Print all config items
    // 如果你自定义了一些必需的命令行选项，但是在启动的时候，又没有填写这些选项，那么是会解析出错，出错后，也会打印出各个选项的信息
    CommandLine commandLine = ServerUtil.parseCmdLine("mqnamesrv", args, buildCommandlineOptions(options), new PosixParser());
    if (null == commandLine) {
        System.exit(-1);
        return;
    }

    // 创建配置对象
    namesrvConfig = new NamesrvConfig();
    nettyServerConfig = new NettyServerConfig();
    nettyClientConfig = new NettyClientConfig();

    // 这里默认启动监听的端口是9876，其实可以在上面的命令行选项中加入一个自定义的选型，并设置一个端口选项
    // 这样就可以在启动的时候通过命令行传入监听端口
    nettyServerConfig.setListenPort(9876);
    controllerConfig = new ControllerConfig();

    // 获取命令行中configFile的值，这个值是配置文件的位置，如果包含这个参数，那么将解析该配置文件，将配置加载到各配置对象中
    if (commandLine.hasOption('c')) {
        String file = commandLine.getOptionValue('c');
        if (file != null) {
            InputStream in = new BufferedInputStream(Files.newInputStream(Paths.get(file)));
            properties = new Properties();
            properties.load(in);
            MixAll.properties2Object(properties, namesrvConfig);
            MixAll.properties2Object(properties, nettyServerConfig);
            MixAll.properties2Object(properties, nettyClientConfig);
            MixAll.properties2Object(properties, controllerConfig);

            namesrvConfig.setConfigStorePath(file);

            System.out.printf("load config properties file OK, %s%n", file);
            in.close();
        }
    }

    // 如果在启动参数加上选项-p，那么将打印出namesrvConfig和nettyServerConfig的属性值信息
    // 其中namesrvConfig主要配置了namesrv的信息，nettyServerConfig主要配置了netty的属性值信息
    // 配置打印结束后就退出进程
    if (commandLine.hasOption('p')) {
        MixAll.printObjectProperties(null, namesrvConfig);
        MixAll.printObjectProperties(null, nettyServerConfig);
        MixAll.printObjectProperties(null, nettyClientConfig);
        MixAll.printObjectProperties(null, controllerConfig);
        System.exit(0);
    }

    // 这里再解析一遍命令行参数，装配namesrvConfig，从代码执行顺序来看，
    // 命令行中的参数优先级要高于配置文件中的配置，因为这里可以覆盖配置文件中的值
    MixAll.properties2Object(ServerUtil.commandLine2Properties(commandLine), namesrvConfig);

    // 如果没有配置系统属性值rocketmq.home.dir或者环境变量ROCKETMQ_HOME，那么将直接退出
    // rocketmq_home默认来源于配置rocketmq.home.dir，如果没有配置，将从环境变量中获取ROCKETMQ_HOME参数
    if (null == namesrvConfig.getRocketmqHome()) {
        System.out.printf("Please set the %s variable in your environment to match the location of the RocketMQ installation%n", MixAll.ROCKETMQ_HOME_ENV);
        System.exit(-2);
    }

    // 自定义日志配置logback_namesrv.xml，可以了解博文(https://www.jianshu.com/p/3b9cb5e22052)来理解日志的配置加载
    LoggerContext lc = (LoggerContext) LoggerFactory.getILoggerFactory();
    JoranConfigurator configurator = new JoranConfigurator();
    configurator.setContext(lc);
    lc.reset();
    configurator.doConfigure(namesrvConfig.getRocketmqHome() + "/conf/logback_namesrv.xml");

    log = InternalLoggerFactory.getLogger(LoggerName.NAMESRV_LOGGER_NAME);

    // 启动过程中打印配置日志
    MixAll.printObjectProperties(log, namesrvConfig);
    MixAll.printObjectProperties(log, nettyServerConfig);

}
```

以上的代码完成了解析配置和装配属性的工作，其主要流程总结如下：

- 第一步：设置一个系统参数，key 为 rocketmq.remoting.version，当前版本值为 Version.V5_0_0，数值为413，将当前 RocketMQ 版本存到系统参数中；

- 第二步：构建命令行选项并解析命令行参数，生成 CommandLine 对象，在构建命令行选型的过程中，一共构建了 $4$ 个选项，如下所示：

  | 选项简称 |    选项全称     | 是否有参数数值 | 是否是必需选项 | 选项描述                                                     |
  | :------: | :-------------: | :------------: | :------------: | :----------------------------------------------------------- |
  |    h     |      help       |     false      |     false      | Print help                                                   |
  |    n     |   namesrvAddr   |      true      |     false      | Name server address list, eg: '192.168.0.1:9876;192.168.0.2:9876' |
  |    c     |   configFile    |      true      |     false      | Name server config properties file                           |
  |    p     | printConfigItem |     false      |     false      | Print all config items                                       |

  那么在启动过程中，可以在命令行中携带这些命令行选项，比如我指定 NameServerAddr，就可以在启动命令后添加 `-n 192.168.0.1:9876;192.168.0.2:9876` 或者 `--namesrvAddr 192.168.0.1:9876;192.168.0.2:9876` 作为启动参数，对于没有参数数值的选项，直接跟上选项简称或者全称即可，例如： `-h` 或者 `--help` ，那么在解析的时候就可以正确解析到命令行参数。

- 第三步：创建配置对象；

- 第四步：设置 NameServer 的启动监听端口，默认是 9876，读者可以直接修改这里的端口号，但是笔者建议额外在 `NamesrvStartup#buildCommandlineOptions` 方法中添加一个命令行选项，例如 `listenPort`，从而支持从命令行中通过`-l`或者`--listenPort`来指定端口，示例代码如下高亮部分：

  :::: code-group
  ::: code-group-item 改造代码1

  ```java{10-13}
  public static Options buildCommandlineOptions(final Options options) {
      Option opt = new Option("c", "configFile", true, "Name server config properties file");
      opt.setRequired(false);
      options.addOption(opt);
  
      opt = new Option("p", "printConfigItem", false, "Print all config items");
      opt.setRequired(false);
      options.addOption(opt);
  
      // 这里额外加一个选项，支持配置自定义监听端口
      opt = new Option("l", "listenPort", true, "Name server custom listening port");
      opt.setRequired(false);
      options.addOption(opt);
      return options;
  }
  ```

  :::
  ::: code-group-item 改造代码2

  ```java{8-13}
  // 创建配置对象
  namesrvConfig = new NamesrvConfig();
  nettyServerConfig = new NettyServerConfig();
  nettyClientConfig = new NettyClientConfig();
  
  // 这里默认启动监听的端口是9876，其实可以在上面的命令行选项中加入一个自定义的选型，并设置一个端口选项
  // 这样就可以在启动的时候通过命令行传入监听端口
  String listenPort;
  if (commandLine.hasOption('l') && (StringUtils.isNumeric(listenPort = commandLine.getOptionValue('l')))) {
      nettyServerConfig.setListenPort(Integer.parseInt(listenPort));
  } else {
      nettyServerConfig.setListenPort(9876);
  }
  controllerConfig = new ControllerConfig();
  ```

  :::
  ::::

- 第五步：获取命令行中configFile的值，这个值是配置文件的绝对路径，如果命令行参数中没有配置，那么将采用默认值，默认值是 `{user.home}/namesrv/namesrv.properties`，解析该配置文件（注意配置文件中的要使用键值对的形式，例如： key=value，且 key 要保持和上述配置对象中的属性名称一致），将配置加载到各配置对象中。并且检查命令行参数中是否包含选项 `p` ，如果包含，那么将打印所有配置信息并退出进程；

- 第六步：检查是否配置系统属性值 `rocketmq.home.dir` 或者环境变量 `ROCKETMQ_HOME`，如果没有配置那么将直接退出进程；

- 第七步：自定义日志配置 logback_namesrv.xml，可以了解 [博文](https://www.jianshu.com/p/3b9cb5e22052) 来理解日志的配置加载；

- 第八步：打印 namesrvConfig 和 nettyServerConfig 的配置信息。

至此，各项配置的解析装配工作就结束了，接下来开始创建并启动NameServer Controller。

### 2.2 创建并启动NamesrvController

这里先贴出创建并启动 NamesrvController 的方法，代码如下：

```java
/**
 * 创建并启动NameServerController
 */
public static void createAndStartNamesrvController() throws Exception {
    // 创建NameServerController对象
    NamesrvController controller = createNamesrvController();
    // 启动NameServerController对象
    start(controller);
    String tip = "The Name Server boot success. serializeType=" + RemotingCommand.getSerializeTypeConfigInThisServer();
    log.info(tip);
    System.out.printf("%s%n", tip);
}
```

从代码中可以看出，主要流程分为两步：

-  第一步：创建NameServerController对象；
-  第二步：启动NameServerController对象。

#### 2.2.1 创建NameServerController对象

我们一起来阅读 NamesrvStartup 的 createNamesrvController 方法，看看在创建 NamesrvController 对象的具体流程，代码如下：
```java
/**
 * 创建NameServerController
 */
public static NamesrvController createNamesrvController() {

    // 构建NamesrvController对象，构造方法里面创建了KVConfigManager、BrokerHousekeepingService、RouteInfoManager、Configuration对象
    final NamesrvController controller = new NamesrvController(namesrvConfig, nettyServerConfig, nettyClientConfig);
    // remember all configs to prevent discard
    // 将配置注册到Configuration中，并被controller持有，防止配置丢失
    controller.getConfiguration().registerConfig(properties);
    return controller;
}
```
调用 NamesrvController 的构造方法创建对象，构造方法里面创建了 KVConfigManager、BrokerHousekeepingService、RouteInfoManager、Configuration 对象，这里简单介绍一下这四个类的作用。

- KVConfigManager：该类是 NameServer 的配置存储类。会将配置信息存储在文件 `{user.home}/namesrv/kvConfig.json`。内部用来存储配置信息的是一个`HashMap<String, HashMap<String, String>>`结构，也就是两级结构。第一级是命名空间，第二级是 KV 对，都是字符串形式。该类的`load`方法可以从文件中加载数据到内存里，`persist`方法可以将内存中的数据再写入到文件中。
- BrokerHousekeepingService：该类是用来处理 broker 连接发生变化的服务。可以看到这个类实现了ChannelEventListener 接口，除了onChannelConnect 外，其余各个方法均委托给 namesrvController 的 routeInfoManager 的 onChannelDestroy 方法。这里需要 netty 的一些基础，简单来说每一个 broker 与 namesrv通过一个“通道” channel 进行“沟通”。namesrv 通过监测这些通道是否发生某些事件，去做出相应的变动。可以点进 routeInfoManager 的 onChannelDestroy 方法看看，对于宕机的 broker 是如何处理的。这一块的内容将在路由原理中详细讲解，这里了解即可。
- RouteInfoManager：这就是 RocketMQ 的路由管理器，其内部维护了路由相关的所有元数据信信息，包括 topic 队列、Broker 地址信息、Broker 集群信息、Broker 活跃信息、Broker 上的 FilterServer 列表等。也因此，提供了扫描不活跃的 Broker、删除 topic、获取 topic 列表、注册 Broker、查询 Broker 的 Topic 配置等基础方法，由对应的网络请求或定时任务进行调用。
- Configuration：用于存储配置文件、命令行中的各项配置，将配置注册到Configuration中，并被controller持有，防止配置丢失。

#### 2.2.2 启动NameServerController对象

创建好 NameServerController 对象以后，接下来就是启动它，`NamesrvStartup#start()` 方法是启动 NameServerControler 的主要逻辑代码，主要流程分为三步：

- 第一步：进行controller的初始化工作
- 第二步：注册钩子函数，当 JVM 正常退出的时候，将执行该钩子函数，执行关闭 controller 释放资源
- 第三步：启动 controller

代码注释如下所示：

```java
/**
 * 启动NameServerController
 */
public static NamesrvController start(final NamesrvController controller) throws Exception {

    if (null == controller) {
        throw new IllegalArgumentException("NamesrvController is null");
    }

    // 第一步：进行controller的初始化工作
    boolean initResult = controller.initialize();

    // 如果初始化controller失败，则直接退出
    if (!initResult) {
        // 关闭controller，释放资源
        controller.shutdown();
        System.exit(-3);
    }

    // 第二步：注册钩子函数，当JVM正常退出的时候，将执行该钩子函数，执行关闭controller释放资源
    Runtime.getRuntime().addShutdownHook(new ShutdownHookThread(log, (Callable<Void>) () -> {
        controller.shutdown();
        return null;
    }));

    // 第三步：启动controller
    // 启动remotingServer、remotingClient、fileWatchService、routeInfoManager服务
    controller.start();

    return controller;
}
```
对于注册了钩子函数，这里向我们展示了一种非常优雅的编程方式，对于代码中使用到了线程池等资源，建议为其注册钩子函数，每当 JVM 退出的时候，去执行钩子函数逻辑，去执行一些资源关闭的操作，这是一种比较优雅的方式。

在正式启动 controller 之前，controller 进行了很多的初始化工作，主要如下所示：

- 第一步：加载 KV 配置，主要流程是从本地文件中加载 KV 配置到内存中，默认加载路径是：`${user.home}/namesrv/kvConfig.json`
- 第二步：构建网络通讯组件：NettyRemotingServer 对象、NettyRemotingClient 对象
- 第三步：初始化线程池，这里面初始化了两个线程池，一个（defaultExecutor）用于处理 Broker 相关请求的线程池，一个（clientRequestExecutor）用于处理客户端（生产者、消费者）相关请求的线程池
- 第四步：注册处理器，用于处理不同类型的请求：
  - ClusterTestRequestProcessor 用于处理测试请求
  - ClientRequestProcessor 用于处理客户端请求，目前包含根据Topic获取路由信息
  - DefaultRequestProcessor 用于处理其余 NameServer 的请求：比如 KV 配置管理、Broker 注册、Broker 心跳、更新/查询 Namesrv 配置等

- 第五步：注册三个定时任务线程池：
  - NameServer 定时默认每隔 $5$ 秒钟（可通过配置文件修改）扫描一次 Broker 列表，移除已经处于非激活状态的 Broker
  - NameServer 定时每隔 $10$ 分钟（可通过配置文件修改）打印一次 KV 的配置信息
  - NameServer 定时每秒钟打印水位信息，将 clientRequestThreadPoolQueue 和 defaultThreadPoolQueue 两个队列中的任务数和第一个未执行任务的延迟时间打印出来（当前时间戳减去任务的创建时间戳）

- 第六步：配置 SSL（Secure Sockets Layer 安全套接字协议）协议，这里支持三种模式：disabled、permissive、enforcing
  - disabled：不支持 SSL，所有 SSL 协议的挥手请求都将被拒绝，连接被关闭
  - permissive：SSL 是可以选的，服务端可以处理客户端的 SSL 的连接或者非 SSL 连接，该选项是默认值
  - enforcing：SSL 是必需的，非 SSL 的连接都将被拒绝

- 第七步：添加 ZoneRouteRPCHook，支持云特性：多 zone 部署和管理，ZoneRouteRPCHook 内部的主要逻辑是在请求（GET_ROUTEINFO_BY_TOPIC）的时候，通过 zone 配置，可以实现路由信息的过滤，然后返回给客户端，实现多 zone 部署和管理

具体代码分析如下所示：
```java
public boolean initialize() {
    // 第一步：加载KV配置，主要流程是从本地文件中加载KV配置到内存中
    // 默认加载路径是：${user.home}/namesrv/kvConfig.json
    loadConfig();

    // 第二步：构建网络通讯组件：NettyRemotingServer对象、NettyRemotingClient对象
    initiateNetworkComponents();

    // 第三步：初始化线程池，这里面初始化了两个线程池，
    // 一个(defaultExecutor)用于处理Broker相关请求的线程池，一个(clientRequestExecutor)用于处理客户端（生产者、消费者）相关请求的线程池
    initiateThreadExecutors();

    // 第四步：注册处理器，用于处理不同类型的请求
    // ClusterTestRequestProcessor用于处理测试请求
    // ClientRequestProcessor用于处理客户端请求，目前包含根据Topic获取路由信息
    // DefaultRequestProcessor用于处理其余NameServer的请求：比如KV配置管理、Broker注册、Broker心跳、更新/查询Namesrv配置
    registerProcessor();

    // 第五步：注册三个定时任务线程池
    // 1.NameServer定时默认每隔5秒钟（可通过配置文件修改）扫描一次Broker列表，移除已经处于非激活状态的Broker
    // 2.NameServer定时每隔10分钟（可通过配置文件修改）打印一次KV的配置信息
    // 3.NameServer定时每秒钟打印水位信息，将clientRequestThreadPoolQueue和defaultThreadPoolQueue
    // 两个队列中的任务数和第一个未执行任务的延迟时间打印出来（当前时间戳减去任务的创建时间戳）
    startScheduleService();

    // 第六步：配置SSL（Secure Sockets Layer 安全套接字协议）协议，这里支持三种模式：disabled、permissive、enforcing
    // disabled:不支持SSL，所有SSL协议的挥手请求都将被拒绝，连接被关闭
    // permissive:SSL是可以选的，服务端可以处理客户端的SSL的连接或者非SSL连接，该选项是默认值
    // enforcing:SSL是必需的，非SSL的连接都将被拒绝
    initiateSslContext();

    // 第七步：添加ZoneRouteRPCHook，支持云特性：多zone部署和管理
    // ZoneRouteRPCHook内部的主要逻辑是在请求（GET_ROUTEINFO_BY_TOPIC）的时候，
    // 通过zone配置，可以实现路由信息的过滤，然后返回给客户端，实现多zone部署和管理
    initiateRpcHooks();
    return true;
}
```
上述代码都给出了详细的注释说明，每个步骤对应的代码内部也基本给出了注释说明，读者可以根据需要去阅读我注释后的 [源代码](https://github.com/itlemon/rocketmq-5.0.0) 。

## 三、文章小结

本文主要讲解的是 NameServer 的启动流程，在启动过程中，首先是解析各种配置，并将配置装配到配置类对象中，这些配置类对象，其实都是有默认值的，正常情况下，不需要用户去自定义这些配置，如果有需要，也可以针对各个配置项去单独配置到配置文件中。配置解析完毕之后，就是开始创建 NameServerController 对象，创建的过程中，其实就是去创建了 KVConfigManager、BrokerHousekeepingService、RouteInfoManager、Configuration 对象，这些组件都是重要组件，NameServer 的主要功能都依靠它们，对象创建完毕后就是初始化必要的线程池、处理器等，待所有必备组件都初始化好了以后，就是启动 NettyServer 了，整个 NameServer 也就启动起来了。

本文并没有对 Netty 进行深入讲解，Netty 不仅仅扮演着 RocketMQ 底层的网络交互组件，它同样也是很多重要 RPC 服务的基础网络组件，感兴趣的读者可以深入去学习和了解 Netty，本系列文章将不着重讲解 Netty，后续将通过发 Netty 系列文章来讲。

了解更多干货，欢迎关注我的微信公众号：爪哇论剑（微信号：itlemon）
![微信公众号-爪哇论剑-itlemon](https://img-blog.csdnimg.cn/20190917130526135.jpeg)