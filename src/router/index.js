import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/login/index.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [{
    path: '/login',
    component: Login

  }]
})