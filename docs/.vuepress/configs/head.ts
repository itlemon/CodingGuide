import type {HeadConfig} from '@vuepress/core'

export const head: HeadConfig[] = [
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
    ["link", {rel: "stylesheet", href: "//at.alicdn.com/t/font_2154804_w16nlfaojue.css"}],
    ['link', {rel: 'manifest', href: '/manifest.webmanifest'}],
    ['meta', {name: 'application-name', content: '程序员乐源'}],
    ['meta', {name: 'apple-mobile-web-app-title', content: '程序员乐源'}],
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
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    // SEO
    ['meta', {name: 'baidu-site-verification', content: 'code-au7BVxnj3F'}],
    ['meta', {name: 'bytedance-verification-code', content: 'xAfRSRE/n7WdGPciSAEj'}],
    ['script', {type: 'text/javascript', src: '/js/toutiao.js'}],
    ['script', {type: 'text/javascript', src: '/js/baidu.js'}]
]
