import {defineUserConfig} from 'vuepress'
import type {DefaultThemeOptions} from 'vuepress'
import {navbar, sidebar} from './configs'

export default defineUserConfig<DefaultThemeOptions>({
    // 站点配置
    locales: {
        '/': {
            lang: 'zh-CN',
            title: '程序员乐源',
            description: 'Programmer\'s source of happiness',
        }
    },

    base: '/',

    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: `/images/icons/favicon-16x16.png`,
            },
        ],
        [
            'link',
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: `/images/icons/favicon-32x32.png`,
            },
        ],
        ['link', {rel: 'manifest', href: '/manifest.webmanifest'}],
        ['meta', {name: 'application-name', content: 'VuePress'}],
        ['meta', {name: 'apple-mobile-web-app-title', content: 'VuePress'}],
        [
            'meta',
            {name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
        ],
        [
            'link',
            {rel: 'apple-touch-icon', href: `/images/icons/apple-touch-icon.png`},
        ],
        [
            'link',
            {
                rel: 'mask-icon',
                href: '/images/icons/safari-pinned-tab.svg',
                color: '#3eaf7c',
            },
        ],
        ['meta', {name: 'msapplication-TileColor', content: '#3eaf7c'}],
        ['meta', {name: 'theme-color', content: '#3eaf7c'}]
    ],

    // 主题和它的配置
    theme: '@vuepress/theme-default',
    themeConfig: {
        logo: 'https://vuejs.org/images/logo.png',
        repo: 'itlemon/CodingGuide',
        docsDir: 'docs',
        locales: {
            '/': {
                // navbar
                navbar: navbar.zh,
                selectLanguageName: '简体中文',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',

                // sidebar
                sidebar: sidebar.zh,

                // page meta
                editLinkText: '在 GitHub 上编辑当前页',
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
                toggleDarkMode: '切换夜间模式',
                toggleSidebar: '切换侧边栏',
            }
        }
    },
})
