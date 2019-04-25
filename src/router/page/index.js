import Layout from '@/pages/index/'
export default [{
    path: '/login',
    name: '登录页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/pages/login/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/404',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/views/404'),
    name: '404',
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }

},
{
    path: '/',
    name: '主页',
    redirect: '/wel'
},
{
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [{
        path: 'index',
        name: '首页',
        component: () =>
            import( /* webpackChunkName: "views" */ '@/pages/wel')
    }]
},
{
    path: '/info',
    component: Layout,
    name:'个人中心',
    redirect: '/info/index',
    children: [{
        path: 'index',
        name: '个人信息',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/views/admin/user/info'),
    }]
},
{
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
        path: ":routerPath",
        name: 'iframe',
        component: () =>
            import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
        props: true
    }]
},
{
    path: '*',
    redirect: '/404',
}
]
