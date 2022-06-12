# Netty中网络通讯模型

![](https://codingguide-1256975789.cos.ap-beijing.myqcloud.com/codingguide/img/netty.png)



## Netty 和 JDK NIO之间的联系

在之前***02JDK NIO原理和关键类分析***章节中详细的学习了NIO在java中实现，不知道大家有没有理解NIO中的一些概念和类之间的联系。请大家思考下，为什么学习Netty之前需要先学习java NIO中的知识点和线程模型Reactor模型？其实Netty本质是对JDK NIO的包装和结合线程Reactor模型设计理念，设计出来的网络通讯产品。接下来我们一起来学习下什么是Reactor模型。



## Reactor模型
