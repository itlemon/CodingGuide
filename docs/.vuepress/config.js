// 博客全局配置
module.exports = {
    port: "8080",
    base: "/",
    // 插件配置
    plugins: [
        // 全文搜索插件
        ['fulltext-search'],
        // 代码复制插件
        ['one-click-copy', {
            copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
            copyMessage: '拷贝成功',
            toolTipMessage: '拷贝',
            duration: 2000,
        }]
    ],
    // markdown相关配置
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: "_blank", rel: "noopener noreferrer"
        },
        // markdown-it-anchor 的选项
        anchor: {permalink: false},
        // markdown-it-toc 的选项
        toc: {includeLevel: [1, 2]}
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "程序员乐源",
            description: "Programmer's source of happiness"
        }
    },
    // 主题配置
    themeConfig: {
        docsRepo: "itlemon/CodingGuide",
        // 编辑文档的所在目录
        docsDir: 'docs',
        // 文档放在一个特定的分支下：
        docsBranch: 'master',
        //logo: "/logo.png",
        editLinks: true,
        sidebarDepth: 0,
        locales: {
            "/": {
                label: "简体中文",
                selectText: "Languages",
                editLinkText: "在 github 上编辑当前页",
                lastUpdated: "最近更新"
            }
        },
        nav: [
            {
                text: '导读',
                link: '/resources/common/start-to-read.md'
            },
            {
                text: '数据结构与算法',
                items: [
                    {
                        text: "数据结构",
                        link: "/resources/data-structure-and-algorithm/start-to-read.md"
                    },
                    {
                        text: "算法基础",
                        link: "/resources/data-structure-and-algorithm/start-to-read.md"
                    }
                ]
            },
            {
                text: "Java",
                items: [
                    {
                        text: "Java基础",
                        link: "/resources/java/foundation/Java基础.md"
                    }
                ]
            },
            {
                text: "RocketMQ",
                link: "/resources/rocketmq/start-to-read.md"
            },
            {
                text: 'Github',
                link: 'https://github.com/itlemon/CodingGuide'
            }
        ],
        sidebar: {
            "/resources/common/": genSideBarReadingGuide(),
            "/resources/data-structure-and-algorithm/": genSideBarDataStructureAndAlgorithm(),
            "/resources/java/foundation/": genSideBarJava(),
            "/resources/rocketmq/": genSideBarRocketMQ()
        }
    }
}

// 阅读指南
function genSideBarReadingGuide() {
    return [
        {
            title: "阅读指南",
            collapsable: false,
            sidebarDepth: 2,
            children: [
                "start-to-read.md"
            ]
        }
    ]
}

// 数据结构与算法
function genSideBarDataStructureAndAlgorithm() {
    return [
        {
            title: "数据结构",
            collapsable: false,
            sidebarDepth: 2,
            children: [
                "data-structure/start-to-read.md"
            ]
        },
        {
            title: "算法基础",
            collapsable: false,
            sidebarDepth: 2,
            children: [
                "algorithm/start-to-read.md"
            ]
        }
    ]
}

// Java专栏
function genSideBarJava() {
    return [
        {
            title: "第一章 基础",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md",
                "Java基础1.md"
            ]
        },
        {
            title: "第二章 非并发集合类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第三章 并发集合类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第四章 队列类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第五章 线程类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第六章 锁类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第七章 线程池类源码分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        },
        {
            title: "第八章 Java虚拟机相关分析",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "Java基础.md"
            ]
        }
    ]
}

// RocketMQ源码分析专栏
function genSideBarRocketMQ() {
    return [
        {
            title: "第一章 RocketMQ源码调试",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "foundation/RocketMQ源码阅读环境配置1.md",
                "foundation/RocketMQ源码阅读环境配置2.md"
            ]
        },
        {
            title: "第二章 RocketMQ NameServer",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "namesrv/NameServer启动源码分析.md",
                "namesrv/NameServer路由源码分析.md"
            ]
        },
        {
            title: "第三章 RocketMQ生产者及消息发送",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "producer/RocketMQ Producer启动原理分析1.md",
                "producer/RocketMQ Producer启动原理分析2.md",
                "producer/RocketMQ Producer消息发送原理分析1.md",
                "producer/RocketMQ Producer消息发送原理分析2.md",
            ]
        },
        {
            title: "第四章 RocketMQ消息存储",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "store/RocketMQ消息存储原理分析1.md",
                "store/RocketMQ消息存储原理分析2.md"
            ]
        },
        {
            title: "第五章 RocketMQ消息消费",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "consumer/RocketMQ消息消费原理分析1.md",
                "consumer/RocketMQ消息消费原理分析2.md"
            ]
        },
        {
            title: "第六章 RocketMQ访问控制",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "acl/RocketMQ ACL源码分析1.md",
                "acl/RocketMQ ACL源码分析2.md"
            ]
        },
        {
            title: "第七章 RocketMQ主从同步",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "sync/RocketMQ主从同步源码分析1.md",
                "sync/RocketMQ主从同步源码分析2.md"
            ]
        },
        {
            title: "第八章 RocketMQ消息轨迹",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "trace/RocketMQ消息轨迹源码分析1.md",
                "trace/RocketMQ消息轨迹源码分析2.md"
            ]
        },
        {
            title: "第九章 RocketMQ主从切换",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "master-slave-switching/RocketMQ主从切换源码分析1.md",
                "master-slave-switching/RocketMQ主从切换源码分析2.md"
            ]
        },
        {
            title: "第十章 RocketMQ监控",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "monitor/RocketMQ监控源码分析1.md",
                "monitor/RocketMQ监控源码分析2.md"
            ]
        }
    ]
}