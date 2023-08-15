import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局*/
import Layout from '@/views/layout/Layout'

/* 路由模块*/
export function constantRouterMap(layout) {
  return [
    {
      path: '/redirect',
      component: layout,
      hidden: true,
      children: [
        {
          path: '/redirect/:path*',
          component: () => import('@/views/redirect/index')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      hidden: true
    },
    {
      path: '/auth-redirect',
      component: () => import('@/views/login/authredirect'),
      hidden: true
    },
    {
      path: '/manage-info',
      component: () => import('@/views/manage/info'),
      hidden: true
    },
    {
      path: '/404',
      component: () => import('@/views/errorPage/404'),
      hidden: true
    },
    {
      path: '/401',
      component: () => import('@/views/errorPage/401'),
      hidden: true
    },
    {
      path: '',
      component: layout,
      redirect: 'dashboard',
      name: 'dashboard',
      meta: { title: "dashboard", icon: "dashboard", noCache: true },
      children: [
        {
          path: 'dashboard',
          index: 0,
          component: () => import('@/views/dashboard/index'),
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
        }
      ]
    },
  ]
}
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap(Layout)
})