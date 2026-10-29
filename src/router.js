import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import About from './about.vue'
import Contact from './contact.vue'

// Was vue-router 3 `new Router({ mode: 'history', ... })` — history mode preserved.
export default createRouter({
  history: createWebHistory(),
  // New pages start at the top (below the sticky header); back/forward
  // restores the saved position; in-page anchors keep their target.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    }
  ]
})
