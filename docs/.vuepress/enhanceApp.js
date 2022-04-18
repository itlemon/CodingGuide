// 百度PV/UV统计
// var _hmt = _hmt || [];
// (function() {
//     var hm = document.createElement("script");
//     hm.src = "https://hm.baidu.com/hm.js?95441a1288ba1c91d088a118a4b4ddbb";
//     var s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(hm, s);
// })();
//
// export default ({router}) => {
//     /**
//      * 路由切换事件处理
//      */
//     router.beforeEach((to, from, next) => {
//         // 触发百度的pv统计
//         if (typeof _hmt != "undefined") {
//             if (to.path) {
//                 _hmt.push(["_trackPageview", to.fullPath]);
//             }
//         }
//         // continue
//         next();
//     });
// };