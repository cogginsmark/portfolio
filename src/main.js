import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initTheme } from './theme.js'
// The font ships with the site: Manrope Variable comes from the
// @fontsource-variable/manrope package, so Vite emits the woff2 files
// as site assets and every visitor loads the font from the site
// itself — no third-party font service, no silent system fallback.
import '@fontsource-variable/manrope'
import './assets/global.css'
import './assets/text.css'

initTheme()

createApp(App).use(router).mount('#app')
