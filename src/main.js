import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initTheme } from './theme.js'
// Liquid Glass experiment (branch feat/liquid-glass): the stylesheet
// of @zakisheriff/liquid-glass, imported before the site's own CSS so
// site rules win where they must.
import '@zakisheriff/liquid-glass/styles.css'
import './assets/global.css'
import './assets/text.css'

initTheme()

createApp(App).use(router).mount('#app')
