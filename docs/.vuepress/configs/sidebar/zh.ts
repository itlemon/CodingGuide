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
        }
    ],
    '/resources/data-structure-and-algorithm/': [
        {
            text: '阅读指南',
            link: '/resources/data-structure-and-algorithm/',
            children: [
                {
                    text: '第一章 数组',
                    collapsible: true,
                    children: [
                        '1-1数组的理论基础.md',
                        '1-2常见的数组算法题.md'
                    ]
                },
                {
                    text: '第二章 链表',
                    collapsible: true,
                    children: [
                        '2-1链表的理论基础.md',
                        '2-2常见的链表算法题.md'
                    ]
                },
                {
                    text: '第三章 哈希表',
                    collapsible: true,
                    children: [
                        '3-1哈希表的理论基础.md',
                        '3-2常见的哈希表算法题.md'
                    ]
                },
                {
                    text: '第四章 字符串',
                    collapsible: true,
                    children: [
                        '4-1字符串的理论基础.md',
                        '4-2常见的字符串算法题.md'
                    ]
                },
                {
                    text: '第五章 栈与队列',
                    collapsible: true,
                    children: [
                        '5-1栈与队列的理论基础.md',
                        '5-2一文搞定单调栈算法题.md',
                        '5-3一文搞定队列算法题.md'
                    ]
                },
                {
                    text: '第六章 二叉树',
                    collapsible: true,
                    children: [
                        '6-1二叉树的理论基础.md',
                        '6-2一文搞定还原二叉树问题.md'
                    ]
                },
                {
                    text: '第七章 回溯算法',
                    collapsible: true,
                    children: [
                        '7-1回溯算法的理论基础.md',
                        '7-2一文搞定岛屿类问题.md'
                    ]
                },
                {
                    text: '第八章 贪心算法',
                    collapsible: true,
                    children: [
                        '8-1贪心算法的理论基础.md',
                        '8-2常见的贪心算法题.md'
                    ]
                },
                {
                    text: '第九章 动态规划',
                    collapsible: true,
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
            text: 'RocketMQ',
            link: '/resources/middleware/rocketmq/',
            collapsible: true,
            children: [
                '01RocketMQ源码阅读环境搭建.md',
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
            text: '其他',
            link: '/resources/middleware/other/'
        }
    ],
}