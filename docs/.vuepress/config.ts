import {defineUserConfig} from '@vuepress/cli';
import {defaultTheme} from '@vuepress/theme-default'
import {googleAnalyticsPlugin} from '@vuepress/plugin-google-analytics'
import {docsearchPlugin} from '@vuepress/plugin-docsearch'
import {pwaPlugin} from '@vuepress/plugin-pwa'
import {pwaPopupPlugin} from '@vuepress/plugin-pwa-popup'
import {gitPlugin} from '@vuepress/plugin-git'
import {copyCodePlugin} from "vuepress-plugin-copy-code2"
import {commentPlugin} from "vuepress-plugin-comment2"
import {sitemapPlugin} from "vuepress-plugin-sitemap2"
import {head, navbarZh, sidebarZh,} from './configs'

export default defineUserConfig({
    // 基础站点配置
    base: '/',
    lang: 'zh-CN',
    title: '程序员乐源',
    description: 'Programmer\'s source of happiness',

    // 网页头配置
    head,

    // 主题配置
    theme: defaultTheme({
        logo: 'https://vuejs.org/images/logo.png',
        repo: 'itlemon/CodingGuide',
        docsBranch: 'master',
        repoLabel: 'GitHub',
        docsDir: 'docs',
        locales: {
            '/': {
                // navbar
                // navbar
                navbar: navbarZh,
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',

                // sidebar
                sidebar: sidebarZh,

                // page meta
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdatedText: '上次更新',
                contributorsText: '贡献者',

                // custom containers
                tip: '提示',
                warning: '注意',
                danger: '警告',

                // 404 page
                notFound: [
                    '这里什么都没有',
                    '我们怎么到这来了？',
                    '这是一个 404 页面',
                    '看起来我们进入了错误的链接',
                ],
                backToHome: '返回首页',

                // a11y
                openInNewWindow: '在新窗口打开',
                toggleColorMode: '切换颜色模式',
                toggleSidebar: '切换侧边栏',
            }
        },

        themePlugins: {
            // only enable git plugin in production mode
            git: true,
            // use shiki plugin in production mode instead
            prismjs: true,
        },
    }),

    // md配置
    markdown: {
        code: {
            lineNumbers: true,
            highlightLines: true
        }
    },

    // 插件配置
    plugins: [
        // 谷歌分析
        googleAnalyticsPlugin({
            id: 'G-EFC6ZD4CWJ'
        }),

        // 全文搜索
        docsearchPlugin({
            appId: 'WSOVOADVOS',
            apiKey: 'bc655b574280a940266b12359a268c40',
            indexName: 'codingguide_query_suggestions',
            searchParameters: {
                facetFilters: ['tags:v2'],
            },
            locales: {
                '/': {
                    placeholder: '搜索文档',
                    translations: {
                        button: {
                            buttonText: '搜索文档',
                            buttonAriaLabel: '搜索文档',
                        },
                        modal: {
                            searchBox: {
                                resetButtonTitle: '清除查询条件',
                                resetButtonAriaLabel: '清除查询条件',
                                cancelButtonText: '取消',
                                cancelButtonAriaLabel: '取消',
                            },
                            startScreen: {
                                recentSearchesTitle: '搜索历史',
                                noRecentSearchesText: '没有搜索历史',
                                saveRecentSearchButtonTitle: '保存至搜索历史',
                                removeRecentSearchButtonTitle: '从搜索历史中移除',
                                favoriteSearchesTitle: '收藏',
                                removeFavoriteSearchButtonTitle: '从收藏中移除',
                            },
                            errorScreen: {
                                titleText: '无法获取结果',
                                helpText: '你可能需要检查你的网络连接',
                            },
                            footer: {
                                selectText: '选择',
                                navigateText: '切换',
                                closeText: '关闭',
                                searchByText: '搜索提供者',
                            },
                            noResultsScreen: {
                                noResultsText: '无法找到相关结果',
                                suggestedQueryText: '你可以尝试查询',
                                reportMissingResultsText: '你认为该查询应该有结果？',
                                reportMissingResultsLinkText: '点击反馈',
                            },
                        },
                    },
                },
            },
        }),

        pwaPlugin({}),
        pwaPopupPlugin({
            locales: {
                '/': {
                    message: '文档已更新，请刷新',
                    buttonText: '刷新',
                },
            },
        }),

        // git插件，这里主要是为了禁止收集部分信息
        gitPlugin({
            contributors: false
        }),

        // 代码拷贝插件
        copyCodePlugin({
            selector: '.theme-default-content div[class*=language-] pre',
            showInMobile: true
        }),

        // 评论插件
        commentPlugin({
            provider: 'Giscus',
            repo: 'itlemon/CodingGuide',
            repoId: 'R_kgDOHL9MTw',
            category: 'Announcements',
            categoryId: 'DIC_kwDOHL9MT84CPCek'
        }),

        // seo增强
        sitemapPlugin({
            hostname: 'https://codingguide.cn'
        }),
    ],

})