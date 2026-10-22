import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import About from './about.vue'
import Contact from './contact.vue'

// Was vue-router 3 `new Router({ mode: 'history', ... })` — history mode preserved.
export default createRouter({
  history: createWebHistory(),
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
