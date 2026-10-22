<template>
  <div class="theme-root" :style="themeVars">
    <slot />
  </div>
</template>

<script>
import { localStore } from '../theme.js'
import light from '../themes/light.ts'
import dark from '../themes/dark.ts'

// Replacement for vue-styled-components' <theme-provider :theme="theme">.
// vue-styled-components 1.6.0 is Vue 2-only (it builds vnodes with the Vue 2
// createElement `attrs` API), so theming now flows as CSS custom properties
// set inline from the active theme object. Component styles consume the
// variables from their SFC <style scoped> blocks; values are exactly the
// theme values the styled-components templates interpolated before.
// (The theme objects' screen widths/paddings are identical in both themes,
// so media queries in the scoped styles use those constants directly —
// CSS variables cannot be used in @media conditions.)
export default {
  name: 'ThemeRoot',
  computed: {
    theme() {
      return localStore.dark ? dark : light
    },
    themeVars() {
      const theme = this.theme
      return {
        '--main-color': theme.color.text,
        '--theme-text': theme.color.text,
        '--link-color': theme.color.link,
        '--hero-background-image': `url("${theme.hero.background.image}")`,
        '--card-background': theme.card.background,
        '--card-box-shadow': theme.card.boxShadow,
        '--card-carousel-opacity': theme.card.carousel.opacity,
        '--card-carousel-box-shadow': theme.card.carousel.boxShadow,
        '--card-button-text': theme.card.button.text,
        '--card-button-background': theme.card.button.background,
        '--card-button-shadow-primary': theme.card.button.boxShadow.primary,
        '--card-button-shadow-secondary': theme.card.button.boxShadow.secondary,
        '--card-button-hover': theme.card.button.boxShadow.hover,
        '--card-button-hover-intensity': theme.card.button.hoverIntensity
      }
    }
  }
}
</script>
