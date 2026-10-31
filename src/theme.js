import { reactive } from 'vue'
import light from './themes/light.ts'
import dark from './themes/dark.ts'

// Shared light/dark theme store. Was duplicated in Home.vue, about.vue and
// contact.vue on top of Vue 2's `Vue.observable(...)`; Vue 3's `reactive()`
// is the direct replacement. All three views now share this one store.
export const localStore = reactive({
  dark: false
})

// The header's session state (Mark's models, 2026-10-30).
// centered: the mobile layout — aligned as-is on load (items
// left, Menu as text), and the first tap on a nav item centres
// the items and collapses the Menu text into its three-circle
// glyph; arriving Home by any route restores the as-is layout.
// navigated: on load the current page's nav item stands as
// bold text alone — its pill appears only after a nav item
// has been clicked (set in the header's click handler, never
// by a route change alone), and stays for the session. The
// pill is one travelling element under the current item, at
// its full hitbox measure: it springs in on the first click,
// travels to the next item when the page changes (duration
// from the distance, at a constant velocity), and dims to a
// reduced standing opacity after its beat.
// Both are in-memory only; a page reload resets them.
export const navStore = reactive({
  centered: false,
  navigated: false
})

export const currentTheme = () => (localStore.dark ? dark : light)

export const mutations = {
  toggleDark() {
    localStore.dark = !localStore.dark
  },
  setDark(isDark) {
    localStore.dark = isDark
  }
}

// Hack until createGlobalStyles comes to vue-styled-components
// (unchanged from the original views — sets the global CSS variables that
// the views' <style> blocks and src/assets/global.css rely on)
export const adjustTheme = () => {
  const theme = currentTheme()
  // Lets CSS make per-theme decisions (e.g. the Home hero rule in
  // global.css) that follow the toggle, not just the OS setting.
  document.documentElement.dataset.theme = localStore.dark ? 'dark' : 'light'
  document.documentElement.style.setProperty('--main-color', theme.color.text)
  document.documentElement.style.setProperty('--main-background-color', theme.color.background)
  document.documentElement.style.setProperty('--fallback-background-color', theme.color.fallbackBackground)
  document.documentElement.style.setProperty('--link-color', theme.color.link)
  // Safari paints the strip behind its bar from theme-color, not
  // from the page: keep it at the gradient's own end colour (the
  // last hex in its definition) so the bar area continues the
  // background instead of cutting it (2026-10-30).
  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    const hexes = theme.color.background.match(/#[0-9a-fA-F]{3,6}\b/g)
    if (hexes && hexes.length) {
      themeColorMeta.setAttribute('content', hexes[hexes.length - 1])
    }
  }
}

export const toggleTheme = () => {
  mutations.toggleDark()
  adjustTheme()
}

let initialised = false

// The original per-view `setup()` + prefers-color-scheme listener, run once
// from main.js instead of once per view module.
export const initTheme = () => {
  if (initialised || typeof window === 'undefined') {
    return
  }
  initialised = true

  if (window.matchMedia) {
    localStore.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        localStore.dark = e.matches
        adjustTheme()
      })
    } catch (e) {
      console.error(e)
    }
  }
  adjustTheme()

  var html = document.getElementsByTagName('html')[0]
  html.style.setProperty('transition', '0.3s color, 0.3s background')
  var body = document.getElementsByTagName('body')[0]
  body.style.setProperty('transition', '0.3s color, 0.3s background')
}
