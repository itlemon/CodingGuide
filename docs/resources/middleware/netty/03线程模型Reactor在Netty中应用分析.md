# 线程Reactor模型在Netty中应用分析

![](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/netty.png)



## Netty 和 JDK NIO之间的联系

在之前***02JDK NIO原理和关键类分析***章节中详细的学习了NIO在java中实现，不知道大家有没有理解NIO中的一些概念和类之间的联系。请大家思考下，为什么学习Netty之前需要先学习java NIO中的知识点和线程模型Reactor模型？其实Netty本质是对JDK NIO的包装和结合线程Reactor模型设计理念，设计出来的网络通讯产品。接下来我们一起来学习下什么是Reactor模型。



## Reactor模型

Reactor模型既不是java专属模型，也不是Netty中创造出来的模型，它是由Doug Lea提出来的一种IO模型指导思想。在Reactor模型中共有三种角色：Reactor、Handlers、Acceptor,以下黄色部分内容为Handler部分。

![single-Reactor](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/single-Reactor.png)

- Reactor：responds to IO events by dispatching the appropriate handler

  > 负责监听和分配事件，将I/O事件分派给对应的Handler。新的事件包含连接建⽴就绪、
  > 读就绪、写就绪等

- Handlers：perform non-blocking actions,Manage by binding handlers to events

  > 将⾃身与事件绑定，执⾏⾮阻塞读/写任务

- Acceptor: distributes to other reactors

  > 处理客户端新连接，并分派请求到处理器链中



### 常见的Reactor模型

- Basic Reactor Design（Reactor单线程模型）
- Multithreaded Designs（Reactor多线程模型）
- Multiple Reactor Threads（主从Reactor多线程模型）



#### Basic Reactor Design

Basic Reactor Design 基本Reactor设计，它是一种Reactor单线程模型。它的新客户端连接、读以及写均在同一个线程中。Reactor充当多路复⽤器⻆⾊，监听多路连接的请求，由单线程完成Reactor收到客户端发来的请求，如果事件类型是ACCEPT,则分发给acceptor完成，其它读写请求由Handler完成）。Handler完成业务逻辑的处理读、解码、计算、编码以及发送。

![single-Reactor](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/single-Reactor.png)



**模型优缺点**

- 优先：所有逻辑都在单线程中处理，结构简单，容易理解和开发，适用于一些低并发和实时性要求不高的场景。
- 缺点：由于是单线程操作，不能充分发挥多核CPU的性能；当Reactor线程负载过重之后，处理速度将变慢，并发性能低；

#### Multithreaded Designs

Multithreaded Designs多线程Reactor模型，这种模型和单线程模型相比：多了一个ThreadPool，所有的处理逻辑放入至线程池中，充分利用机器多CPU资源，提供了并发处理能力。

![multthread-reactor](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/multthread-reactor.png)





**模型优缺点**

- 优先：可以解决单线程中的缺点问题；

- 缺点：多线程数据共享和访问⽐较复杂（⼦线程完成业务处理后，把结果传递给主线程Reactor发送，会涉及共享数据的互斥）；Reactor承担所有事件的监听和响应，只在主线程中运⾏，可能会存在性能问题。

  

#### Multiple Reactor Threads

Multiple Reactor Threads 多Reactor模型，该模型中Reactor分为主和子Reactor，将连接事件、读写事件分给不同的Reactor处理。该模型响应快，不必为单个同步事件所阻塞；可扩展性强，可以⽅便地通过增加subReactor实例个数来充分利⽤CPU资源。

![multreactor](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/multreactor.png)



## Netty中线程模型

Reactor模型有以上三个版本，那Netty中选择的Reactor模型是哪个呢？很显然如下图所示，选择的是多Reactor模型，Netty线程模型中也有主Reactor、Acceptor、subReactor。主Reactor负责连接事件；随后交由Acceptor操作读写subReactor初始化工作；subReactor进行读写事件处理。

![netty-thread](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/netty-thread.png)



## 总结

今日主要分享了Reactor模型中三个角色：Reactor、Handler、Acceptor。随后分析了Reactor几个版本的区别以及优缺点，最后总结了Netty中实现了Reactor哪个版本的设计思想。
