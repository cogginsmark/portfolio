import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import About from './about.vue'
import Videos from './videos.vue'
import Contact from './contact.vue'
import LiquidGlassShowcase from './liquid-glass-showcase.vue'

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
      path: '/videos',
      name: 'videos',
      component: Videos
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      // Branch-only (feat/liquid-glass): the component bench for
      // the translated Liquid Glass library. Not linked from the
      // nav; it exists so every ported component can be exercised
      // live on the branch preview.
      path: '/liquid-glass',
      name: 'liquid-glass-showcase',
      component: LiquidGlassShowcase
    }
  ]
})
