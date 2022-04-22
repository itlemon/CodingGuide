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
            children: [
                '01 为什么要学习数据结构.md',
                '02 数组.md',
                '03 链表.md',
            ],
        },
        {
            text: '算法',
            link: '/resources/data-structure-and-algorithm/algorithm/',
            children: [
                {
                    text: '数组',
                    children: [
                        '/resources/data-structure-and-algorithm/algorithm/01 数组类算法题.md',
                        '/resources/data-structure-and-algorithm/algorithm/02 链表类算法题.md',
                        '/resources/data-structure-and-algorithm/algorithm/03 二叉树类算法题.md'
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
    '/zh/reference/': [
        {
            text: 'VuePress 参考',
            collapsible: true,
            children: [
                '/zh/reference/cli.md',
                '/zh/reference/config.md',
                '/zh/reference/frontmatter.md',
                '/zh/reference/components.md',
                '/zh/reference/plugin-api.md',
                '/zh/reference/theme-api.md',
                '/zh/reference/client-api.md',
                '/zh/reference/node-api.md',
            ],
        },
        {
            text: '打包工具参考',
            collapsible: true,
            children: [
                '/zh/reference/bundler/vite.md',
                '/zh/reference/bundler/webpack.md',
            ],
        },
        {
            text: '默认主题参考',
            collapsible: true,
            children: [
                '/zh/reference/default-theme/config.md',
                '/zh/reference/default-theme/frontmatter.md',
                '/zh/reference/default-theme/components.md',
                '/zh/reference/default-theme/markdown.md',
                '/zh/reference/default-theme/styles.md',
                '/zh/reference/default-theme/extending.md',
            ],
        },
        {
            text: '官方插件参考',
            collapsible: true,
            children: [
                {
                    text: '常用功能',
                    children: [
                        '/zh/reference/plugin/back-to-top.md',
                        '/zh/reference/plugin/container.md',
                        '/zh/reference/plugin/external-link-icon.md',
                        '/zh/reference/plugin/google-analytics.md',
                        '/zh/reference/plugin/medium-zoom.md',
                        '/zh/reference/plugin/nprogress.md',
                        '/zh/reference/plugin/register-components.md',
                    ],
                },
                {
                    text: '内容搜索',
                    children: [
                        '/zh/reference/plugin/docsearch.md',
                        '/zh/reference/plugin/search.md',
                    ],
                },
                {
                    text: 'PWA',
                    children: [
                        '/zh/reference/plugin/pwa.md',
                        '/zh/reference/plugin/pwa-popup.md',
                    ],
                },
                {
                    text: '语法高亮',
                    children: [
                        '/zh/reference/plugin/prismjs.md',
                        '/zh/reference/plugin/shiki.md',
                    ],
                },
                {
                    text: '主题开发',
                    children: [
                        '/zh/reference/plugin/active-header-links.md',
                        '/zh/reference/plugin/git.md',
                        '/zh/reference/plugin/palette.md',
                        '/zh/reference/plugin/theme-data.md',
                        '/zh/reference/plugin/toc.md',
                    ],
                },
            ],
        },
    ],
}
