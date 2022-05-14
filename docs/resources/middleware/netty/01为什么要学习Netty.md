# 为什么要学习Netty



![components](https://gitee.com/itlemon/itlemon-drawing-bed/raw/master/img/components.png)

## Netty在开源项目中贡献

`Dubbo`、`zookeeper`、`RocketMQ`、`ElasticSearch`、`Spring5`、`GRpc`等知名开源项目底层通讯框架都在使用 Netty，为什么Netty能够被如此多开源项目为之痴迷？



## 什么是Netty

>Netty is an asynchronous event-driven network application framework for rapid development of maintainable high performance protocol servers & clients.
>
>Netty is a NIO client server framework which enables quick and easy development of network applications such as protocol servers and clients. It greatly simplifies and streamlines network programming such as TCP and UDP socket server.
>
>'Quick and easy' doesn't mean that a resulting application will suffer from a maintainability or a performance issue. Netty has been designed carefully with the experiences earned from the implementation of a lot of protocols such as FTP, SMTP, HTTP, and various binary and text-based legacy protocols. As a result, Netty has succeeded to find a way to achieve ease of development, performance, stability, and flexibility without a compromise.
>
>[^https://netty.io/]: 以上描述来自官网

- Netty 是一个异步基于事件驱动的网络应用框架，用于快速开发可维护的高性能服务器和客户端。
- Netty 是一个 NIO 客户端-服务器框架，它能够快速、简单地开发网络应用程序，如服务器和客户端。
- “快速和简单”并不意味着应用程序将面临可维护性或性能问题。Netty经过精心设计，并积累了许多协议（如 ftp、smtp、http）的实践经验，以及各种二进制和基于文本的遗留协议。因此，Netty 在不妥协的情况下，成功地实现了易于开发、性能、稳定性和灵活性的特性。



## 作为java程序员为什么要学习Netty?

作为java程序员为什么要学习Netty？随着近几年架构演进的发展，越来越多的企业大型后台逐渐使用微服务架构，服务系统也越来越庞大，服务之间的通讯也是微服务实现的关键技术之一。Netty因其若干的网络通讯特性，被大量的项目作为低层网络通讯模块。因此了解Netty是如何实现的，对于开发显得尤为重要。接下来，我将从以下几个章节来分析Netty源码和Netty设计原理以及设计理念，让我们做到知其然而知其所以然。

- JDK NIO原理和关键类分析
- Netty中网络通讯模型
- Netty服务端启动流程
- Netty任务执行器NioEventLoop分析
- Netty中触发事件管道Pipeline分析
- Netty中是如何检测新连接
- Netty中是如何实现数据读取和写出
- Netty中缓冲池ByteBuffer分析
- Netty是如何实现数据解码和编码分析
- Netty中部分优化工具类分析
- Netty中涉及的设计模式
- Netty案例分析



> 欢迎大家浏览程序员乐源，一个专注于分享的平台：https://codingguide.cn/

