import type {NavbarConfig} from '@vuepress/theme-default'

export const navbarZh: NavbarConfig = [
    {
        text: 'ChatGPT',
        link: '/resources/chatgpt/'
    },
    {
        text: '数据结构与算法',
        link: '/resources/data-structure-and-algorithm/'
    },
    {
        text: 'Java',
        children: [
            {
                text: 'Java基础',
                link: '/resources/java/base/'
            },
            {
                text: 'JVM',
                link: '/resources/java/jvm/'
            }
        ]
    },
    {
        text: '中间件',
        children: [
            {
                text: 'Netty',
                link: '/resources/middleware/netty/'
            },
            {
                text: 'RocketMQ',
                link: '/resources/middleware/rocketmq/'
            },
            {
                text: '其他',
                link: '/resources/middleware/other/'
            }
        ]
    },
    {
        text: 'Spring',
        link: '/resources/spring/'
    },
    {
        text: '缓存',
        link: '/resources/cache/'
    },
    {
        text: '大数据',
        children: [
            {
                text: 'hsql',
                link: '/resources/bigdata/hsql/'
            }
        ]
    },
]
