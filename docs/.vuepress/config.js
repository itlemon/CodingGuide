// 博客全局配置
module.exports = {
    port: "8080",
    base: "/",
    // 是否开启默认预加载js
    shouldPrefetch: (file, type) => {
        return false;
    },
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
                items: [
                    {
                        text: "RocketMQ源码阅读环境配置",
                        link: "/resources/rocketmq/foundation/RocketMQ源码阅读环境配置.md"
                    }
                ]
            },
            {
                text: 'Github',
                link: 'https://github.com/itlemon/CodingGuide'
            }
        ]
    }
}