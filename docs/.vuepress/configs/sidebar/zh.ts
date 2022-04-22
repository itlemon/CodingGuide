import type {SidebarConfig} from '@vuepress/theme-default'

export const zh: SidebarConfig = {
    '/resources/guide/': [
        {
            text: '阅读指南',
            collapsible: true,
            children: [
                'README.md',
                'getting-started.md'
            ],
        },
        {
            text: '阅读指南1',
            collapsible: true,
            children: [
                'README.md',
                'getting-started.md'
            ],
        },
    ],
    '/resources/data-structure-and-algorithm/': [
        {
            text: '数据结构',
            link: '/resources/data-structure-and-algorithm/data-structure/',
            collapsible: true,
            children: [
                '01 为什么要学习数据结构.md',
                '02 数组.md',
                '03 链表.md',
            ],
        },
        {
            text: '算法',
            link: '/resources/data-structure-and-algorithm/algorithm/',
            collapsible: true,
            children: [
                {
                    text: '数组',
                    children: [
                        '01 数组类算法题.md',
                        '02 链表类算法题.md',
                        '03 二叉树类算法题.md'
                    ]
                },
                {
                    text: '其他',
                    children: [
                        '01 数组类算法题.md',
                        '02 链表类算法题.md',
                        '03 二叉树类算法题.md'
                    ]
                }
            ],
        },
    ],
    '/resources/java/': [
        {
            text: 'Java基础',
            link: '/resources/java/base/',
            collapsible: true,
            children: [
                '01 为什么需要学习本专栏.md',
                '02 常用基础类源码解析.md',
                '03 JDK常用工具类源码解析.md',
                '04 ArrayList源码解析.md',
                '05 LinkedList源码解析.md',
                '06 JDK7-HashMap源码解析.md',
                '07 JDK8-HashMap源码解析.md',
                '08 HashSet源码解析.md',
                '09 TreeSet源码解析.md',
                '10 Guava中常用的List及Map工具类.md',
                '11 CopyOnWriteArrayList源码解析.md',
                '12 ConcurrentHashMap源码解析.md',
                '13 LinkedBlockingQueue源码解析.md',
                '14 SynchronousQueue源码解析.md',
                '15 DelayQueue源码解析.md',
                '16 ArrayBlockingQueue源码解析.md',
                '17 队列番外篇：队列的应用.md',
                '18 队列番外篇：手写一个队列.md',
                '19 AbstractQueuedSynchronizer源码解析(上).md',
                '20 AbstractQueuedSynchronizer源码解析(下).md',
                '21 ReentrantLock源码解析.md',
                '22 Atomic类、CountDownLatch等源码解析.md',
                '23 理解并发锁.md',
                '24 Thread源码解析.md',
                '25 ThreadPoolExecutor源码解析.md',
                '26 按场景正确选择线程池.md',
                '27 Java中常见的函数式接口.md',
                '28 ThreadLocal源码解析.md',
            ],
        },
        {
            text: 'JVM',
            link: '/resources/java/jvm/',
            collapsible: true,
            children: [
                '01 JVM基础(上).md',
                '02 JVM基础(下).md',
            ],
        }
    ],
    '/resources/middleware/': [
        {
            text: 'RocketMQ',
            link: '/resources/middleware/rocketmq/',
            collapsible: true,
            children: [
                '01 RocketMQ源码阅读环境搭建.md',
                '02 NameServer启动源码分析.md',
                '03 Producer启动原理分析.md',
                '04 Producer消息发送原理分析.md',
                '05 RocketMQ消息存储原理分析(上).md',
                '06 RocketMQ消息存储原理分析(下).md',
                '07 RocketMQ消息消费原理分析(上).md',
                '08 RocketMQ消息消费原理分析(下).md',
                '09 RocketMQ ACL源码分析(上).md',
                '10 RocketMQ ACL源码分析(下).md',
                '11 RocketMQ主从同步源码分析(上).md',
                '12 RocketMQ主从同步源码分析(下).md',
                '13 RocketMQ消息轨迹源码分析(上).md',
                '14 RocketMQ消息轨迹源码分析(下).md',
                '15 RocketMQ主从切换源码分析.md',
                '16 RocketMQ监控源码分析.md',
            ],
        },
        {
            text: '其他',
            link: '/resources/middleware/other/'
        }
    ]
}
