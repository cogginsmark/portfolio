<template>
  <div id="contact">
  <ThemeRoot>
    <section class="contact-intro" aria-labelledby="contact-intro-heading">
      <div class="contact-intro-text">
        <h1 id="contact-intro-heading" class="contact-intro-heading">{{ name }}</h1>
        <p class="contact-intro-role">{{ hero.subtitle }}</p>
      </div>
    </section>
    <hero
      v-bind:author="author"
      v-bind:subtitle="hero.subtitle"
      v-bind:description="hero.description"
      v-bind:cta="hero.cta"
      v-bind:cta-url="hero.url"
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

<style scoped>
/* The intro block from the About page, at the top of Contact and
   centred: portrait, name and role in one row that wraps on small
   screens. Units follow the site rule: rem for sizes and spacing,
   em for letter tracking, px only for hairline borders. */
.contact-intro {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 61.25rem;
  margin: 0 auto;
  padding: 3rem 1.25rem 0;
}

.contact-intro-heading {
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.35rem;
}

.contact-intro-role {
  margin: 0;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.7;
}

@media (max-width: 40rem) {
  .contact-intro {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }
}
</style>
