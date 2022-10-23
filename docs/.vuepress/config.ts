import {defineUserConfig} from 'vuepress'
import {defaultTheme} from 'vuepress'
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
})