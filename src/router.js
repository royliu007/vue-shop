import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login/login'
import home from './views/home/home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home
    }
  ]
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
  //如果在登录页面，正常跳转
  if (to.path === '/login') return next()
  //获取token，判断是否有token,有的话正常跳转，否则返回登录页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
