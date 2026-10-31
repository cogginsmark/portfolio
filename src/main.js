import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initTheme } from './theme.js'
// Liquid Glass (branch feat/liquid-glass, rebuilt from main): the
// stylesheet of @zakisheriff/liquid-glass v0.3.13, imported before
// the site's own CSS so site rules win where they must. The Vue
// components live under src/components/liquid-glass/ — a direct
// translation of the library's React components, engine included.
import '@zakisheriff/liquid-glass/styles.css'
// This port's own optical balancing layer (patch 005): cap-height
// derived padding and glyph sizing for the library's pills,
// imported with the port, after the package stylesheet.
import './components/liquid-glass/optical.css'
import './assets/global.css'
import './assets/text.css'

initTheme()

createApp(App).use(router).mount('#app')
