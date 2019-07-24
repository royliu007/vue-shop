import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/login'
import Home from '../views/home/home'
import Welcome from '../views/home/welcome/index'
import Users from '../views/home/users/users'
import rightsList from '../views/home/Permissions/rightsList/rightsList.vue'
import Roles from '../views/home/Permissions/roles/roles.vue'
import Cates from '../views/home/goods/categories/cates.vue'
import Params from '../views/home/goods/params/params.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: rightsList },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cates },
        { path: '/params', component: Params }
      ]
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
