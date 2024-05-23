import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./App.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./about.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./contact.vue')
    }
  ]
})