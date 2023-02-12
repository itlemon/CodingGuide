import type {SidebarConfig} from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
    '/resources/data-structure-and-algorithm/': [
        {
            text: '阅读指南',
            link: '/resources/data-structure-and-algorithm/',
            children: [
                {
                    text: '第一章 数组',
                    children: [
                        '1-1数组的理论基础.md',
                        '1-2数组的二分查找算法.md',
                        '1-3数组的双指针算法.md',
                        '1-4数组的滑动窗口算法.md',
                        '1-5数组十大排序算法.md',
                        '1-6数组基础算法题.md'
                    ]
                },
                {
                    text: '第二章 链表',
                    children: [
                        '2-1链表的理论基础.md',
                        '2-2常见的链表算法题.md'
                    ]
                },
                {
                    text: '第三章 哈希表',
                    children: [
                        '3-1哈希表的理论基础.md',
                        '3-2常见的哈希表算法题.md'
                    ]
                },
                {
                    text: '第四章 字符串',
                    children: [
                        '4-1字符串的理论基础.md',
                        '4-2常见的字符串算法题.md'
                    ]
                },
                {
                    text: '第五章 栈与队列',
                    children: [
                        '5-1栈与队列的理论基础.md',
                        '5-2一文搞定单调栈算法题.md',
                        '5-3一文搞定队列算法题.md'
                    ]
                },
                {
                    text: '第六章 二叉树',
                    children: [
                        '6-1二叉树的理论基础.md',
                        '6-2一文搞定还原二叉树问题.md'
                    ]
                },
                {
                    text: '第七章 回溯算法',
                    children: [
                        '7-1回溯算法的理论基础.md',
                        '7-2一文搞定岛屿类问题.md'
                    ]
                },
                {
                    text: '第八章 贪心算法',
                    children: [
                        '8-1贪心算法的理论基础.md',
                        '8-2常见的贪心算法题.md'
                    ]
                },
                {
                    text: '第九章 动态规划',
                    children: [
                        '9-1动态规划的理论基础.md',
                        '9-2常见的动态规划算法题.md'
                    ]
                },
            ],
        },
    ],
    '/resources/java/': [
        {
            text: 'Java基础',
            link: '/resources/java/base/',
            collapsible: true,
            children: [
                '01为什么需要学习本专栏.md',
                '02常用基础类源码解析.md',
                '03JDK常用工具类源码解析.md',
                '04ArrayList源码解析.md',
                '05LinkedList源码解析.md',
                '06JDK7-HashMap源码解析.md',
                '07JDK8-HashMap源码解析.md',
                '08HashSet源码解析.md',
                '09TreeSet源码解析.md',
                '10Guava中常用的List及Map工具类.md',
                '11CopyOnWriteArrayList源码解析.md',
                '12ConcurrentHashMap源码解析.md',
                '13LinkedBlockingQueue源码解析.md',
                '14SynchronousQueue源码解析.md',
                '15DelayQueue源码解析.md',
                '16ArrayBlockingQueue源码解析.md',
                '17队列番外篇：队列的应用.md',
                '18队列番外篇：手写一个队列.md',
                '19AbstractQueuedSynchronizer源码解析(上).md',
                '20AbstractQueuedSynchronizer源码解析(下).md',
                '21ReentrantLock源码解析.md',
                '22Atomic类、CountDownLatch等源码解析.md',
                '23理解并发锁.md',
                '24Thread源码解析.md',
                '25ThreadPoolExecutor源码解析.md',
                '26按场景正确选择线程池.md',
                '27Java中常见的函数式接口.md',
                '28ThreadLocal源码解析.md',
            ],
        },
        {
            text: 'JVM',
            link: '/resources/java/jvm/',
            collapsible: true,
            children: [
                '01JVM基础(上).md',
                '02JVM基础(下).md',
            ],
        }
    ],
    '/resources/middleware/': [
        {
            text: '阅读指南',
            link: '/resources/middleware/rocketmq/',
            children: [
                {
                    text: '第一章 搭建源码环境',
                    children: [
                        '1-1RocketMQ源码阅读环境搭建.md'
                    ]
                },
                '02NameServer启动源码分析.md',
                '03Producer启动原理分析.md',
                '04Producer消息发送原理分析.md',
                '05RocketMQ消息存储原理分析(上).md',
                '06RocketMQ消息存储原理分析(下).md',
                '07RocketMQ消息消费原理分析(上).md',
                '08RocketMQ消息消费原理分析(下).md',
                '09RocketMQ ACL源码分析(上).md',
                '10RocketMQ ACL源码分析(下).md',
                '11RocketMQ主从同步源码分析(上).md',
                '12RocketMQ主从同步源码分析(下).md',
                '13RocketMQ消息轨迹源码分析(上).md',
                '14RocketMQ消息轨迹源码分析(下).md',
                '15RocketMQ主从切换源码分析.md',
                '16RocketMQ监控源码分析.md',
            ],
        },
        {
            text: 'Netty',
            link: '/resources/middleware/netty/',
            collapsible: true,
            children: [
                '01为什么要学习Netty.md',
                '02JDK NIO原理和关键类分析.md',
                '03线程模型Reactor在Netty中应用分析.md',
                '04Netty服务端启动流程.md',
                '05Netty任务执行器NioEventLoop分析.md',
                '06Netty触发事件管道Pipeline分析.md',
                '07Netty是如何检测新连接.md',
                '08Netty是如何实现数据读取和写出.md',
                '09Netty缓冲池ByteBuffer分析.md',
                '10Netty是如何实现数据解码和编码分析.md',
                '11Netty部分优化工具类分析.md',
                '12Netty中涉及的数据结构与算法.md',
                '13Netty中涉及的设计模式.md',
                '14-1Netty在RPC框架中的应用.md',
                '14-2Netty在RocketMQ中应用.md'
            ],
        },
        {
            text: '其他',
            link: '/resources/middleware/other/'
        }
    ],
    '/resources/bigdata/': [
        {
            text: 'sql面试题',
            link:'/resources/bigdata/hsql',
            children: [
                '1-行列转换.md',
                '2-排名取它值.md',
                '3-累计求值.md',
                '4-窗口大小的控制.md',
                '5-不使用distinct和group by分组.md',
                'README.md'
            ],
        },
        {
            text: 'hive sql函数总结',
            link:'/resources/bigdata/hsql',
            children: [

                'README.md'
            ],
        }
    ],
}
