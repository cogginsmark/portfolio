import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initTheme } from './theme.js'
import './assets/global.css'
import './assets/text.css'

initTheme()

createApp(App).use(router).mount('#app')
