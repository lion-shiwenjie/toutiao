import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/login/index.vue'
import home from '@/views/home/index.vue'
import welcome from '@/views/welcome'
import article from '@/views/article'
import image from '@/views/image'
import publish from '@/views/publish'
import comment from '@/views/comment'
import fans from '@/views/fans'
import setting from '@/views/setting'
import error from '@/views/error404'
import local from '../utils/local'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login

  },
  {
    path: '/',
    component: home,
    children: [
      {
        path: '/',
        component: welcome
      },
      {
        path: '/article',
        component: article
      },
      {
        path: '/image',
        component: image
      },
      {
        path: '/publish',
        component: publish
      },
      {
        path: '/comment',
        component: comment
      },
      {
        path: '/fans',
        component: fans
      },
      {
        path: '/setting',
        component: setting
      }
    ]
  }, {
    path: '*',
    component: error
  }
  ]

})

router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (to.path !== '/login' && !user) {
    return next('/login')
  }
  next()
})
export default router
