import {defineUserConfig} from 'vuepress'
import {defaultTheme} from 'vuepress'
import {googleAnalyticsPlugin} from '@vuepress/plugin-google-analytics'
import {pwaPlugin} from '@vuepress/plugin-pwa'
import {pwaPopupPlugin} from '@vuepress/plugin-pwa-popup'
import {gitPlugin} from '@vuepress/plugin-git'
import {searchPlugin} from '@vuepress/plugin-search'
import {copyCodePlugin} from 'vuepress-plugin-copy-code2'
import {commentPlugin} from 'vuepress-plugin-comment2'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'
import {svgIconPlugin} from '@goy/vuepress-plugin-svg-icons'
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
        logo: '/images/logo.png',
        logoDark: '/images/logo_dark.png',
        repo: 'itlemon/CodingGuide',
        docsBranch: 'master',
        repoLabel: 'GitHub',
        docsDir: 'docs',
        locales: {
            '/': {
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

    // 开发相关的配置，设置为4000
    port: 4000,

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

        // docsearch
        searchPlugin({
            locales: {
                '/': {
                    placeholder: '搜索',
                }
            },
            // 排除首页
            isSearchable: (page) => page.path !== '/',
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
            hostname: 'https://codingguide.cn',
            author: 'itlemon'
        }),

        // svg插件
        svgIconPlugin({
            svgsDir: '.vuepress/public/icons'
        }),
    ],
})