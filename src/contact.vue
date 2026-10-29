<template>
  <div id="contact">
  <ThemeRoot>
    <hero
      v-bind:author="author"
      v-bind:subtitle="hero.subtitle"
      v-bind:description="hero.description"
      v-bind:cta="hero.cta"
    />
    <foot v-bind:author="author" v-bind:footer="footer" />
    </ThemeRoot>
  </div>
</template>

<script>
import Hero from './components/Hero.vue'
import Foot from './components/Foot.vue'
import ThemeRoot from './components/ThemeRoot.vue'

import baseData from './data/3fixtures.ts'

// See Home.vue / src/theme.js for the shared theme-store migration notes.
export default {
  name: 'Contact',
  components: {
    Hero,
    Foot,
    ThemeRoot,
  },
  data: () => ({
    ...baseData
  })
}
</script>

<style>
/* Hack until createGlobalStyles comes to vue-styled-components */
html {
  background: var(--main-background-color);
  background-color: var(--fallback-background-color);
}

.top-left-nav {
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
  background-color: #fff;
  z-index: 1000;
}

.top-left-nav > a {
  margin-right: 10px;
}

body {
  color: var(--main-color);
}

a {
  color: var(--link-color);
}
</style>
