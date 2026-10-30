<template>
  <div id="home">
  <ThemeRoot>
    <hero
      v-bind:author="author"
      v-bind:subtitle="hero.subtitle"
      v-bind:description="hero.description"
      v-bind:cta="hero.cta"
      v-bind:cta-url="hero.url"
      v-bind:cta2="hero.cta2"
      v-bind:cta2-url="hero.url2"
      v-bind:cta3="hero.cta3"
      v-bind:cta3-url="hero.url3"
    />
    <div class="card-container" id="products">
      <card
        v-for="(product, index) in products.featured" :key="index"
        v-bind:name="product.name"
        v-bind:medium="product.medium"
        v-bind:summary="product.summary"
        v-bind:copy="product.copy"
        v-bind:links="product.links"
        v-bind:images="product.images"
      />
      <div class="minor-card-container">
        <minor-card
          v-for="(product, index) in products.minor && products.minor.slice(0,3)" :key="index"
          v-bind:name="product.name"
          v-bind:description="product.description"
          v-bind:link="product.link"
        />
      </div>
      <div class="logo-section-container">
        <h1 class="text-main-title">{{logoSection.title}}</h1>
        <div class="logo-container">
          <div class="logo-track">
            <div class="logo-set">
              <logo-card
                v-for="(logo, index) in logoSection.logos && logoSection.logos.slice(0,3)" :key="index"
                v-bind:src="logo.src"
                v-bind:url="logo.url"
                v-bind:alt="logo.alt"
              />
            </div>
            <div class="logo-set" aria-hidden="true" inert>
              <logo-card
                v-for="(logo, index) in logoSection.logos && logoSection.logos.slice(0,3)" :key="'dup-' + index"
                v-bind:src="logo.src"
                v-bind:url="logo.url"
                v-bind:alt="logo.alt"
              />
            </div>
          </div>
        </div>
        <p class="logo-list-text">{{ (logoSection.logos || []).slice(0,3).map((logo) => logo.alt).join(' · ') }}</p>
      </div>
    </div>
    <foot v-bind:author="author" v-bind:footer="footer" />
    </ThemeRoot>
  </div>
</template>

<script>
import Hero from './components/Hero.vue'
import Card from './components/Card.vue'
import MinorCard from './components/MinorCard.vue'
import LogoCard from './components/LogoCard.vue'
import Foot from './components/Foot.vue'
import ThemeRoot from './components/ThemeRoot.vue'

import baseData from './data/fixtures.ts'

// Theme store, global styles and the toggle were previously defined inline
// here with vue-styled-components (ThemeProvider/injectGlobal) and
// Vue.observable; see src/theme.js, src/components/ThemeRoot.vue,
// src/assets/global.css and src/components/LightToggle.vue.
export default {
  name: 'App',
  components: {
    Hero,
    Card,
    MinorCard,
    Foot,
    ThemeRoot,
    LogoCard
  },
  data: () => ({
    ...baseData
  })
}
</script>

<style scoped>
.card-container {
  margin-top: -5.25rem;
}
@media screen and (max-width: 61.25rem) {
  .card-container {
    margin-top: -5.25rem;
    /* The gutter lives on the container, not on each card
       (2026-10-30): the fluid pass took the cards to width 100%
       with nothing at the sides, so on a phone they ran edge to
       edge. The site's standard 1.25rem side padding insets the
       major cards, the minor cards and the logo strip together,
       under their own caps. */
    padding-inline: 1.25rem;
  }
}
@media screen and (max-width: 37.5rem) {
  .card-container {
    margin-top: -6.5rem;
  }
}

.minor-card-container {
  margin: auto;
  margin-bottom: 80px;
  width: 100%;
  max-width: 980px;
  display: flex;
}
.minor-card-container > * {
  margin: 16px;
}
.minor-card-container > *:nth-child(3n+1) {
  margin-left: 0px;
}
.minor-card-container > *:nth-child(3n+0) {
  margin-right: 0px;
}
@media screen and (max-width: 980px) {
  .minor-card-container {
    width: 100%;
    flex-direction: column;
  }
  .minor-card-container > * {
    margin: 16px 0px;
  }
  .minor-card-container > *:nth-child(3n+1) {
    margin: 16px 0px;
  }
  .minor-card-container > *:nth-child(3n+0) {
    margin: 16px 0px;
  }
}
@media screen and (max-width: 600px) {
  .minor-card-container {
    flex-direction: column;
  }
}

.logo-section-container {
  margin: auto;
  text-align: center;
  width: 100%;
  max-width: 980px;
}

.logo-container {
  justify-content: center;
  margin: auto;
  margin-top: 20px;
  width: 100%;
  display: flex;
}

/* On desktop the track and sets are transparent to layout: the
   three cards sit in the centred row exactly as before, the
   duplicate set is not rendered, and the text line stays hidden. */
.logo-track,
.logo-set {
  display: contents;
}
.logo-set + .logo-set {
  display: none;
}
.logo-list-text {
  display: none;
}

/* On smaller screens the strip stays horizontal and scrolls in a
   seamless loop (Mark's direction, 2026-10-30): the set is
   duplicated once in the markup and the track translates by
   exactly one set, edges faded, with a plain text line under it
   denoting the exact list. */
@media screen and (max-width: 980px) {
  .logo-container {
    overflow: hidden;
    justify-content: flex-start;
    -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  }
  .logo-track {
    display: flex;
    width: max-content;
    animation: logo-scroll 22s linear infinite;
  }
  .logo-set {
    display: flex;
  }
  .logo-set + .logo-set {
    display: flex;
  }
  .logo-list-text {
    display: block;
    margin: 0.75rem 1rem 0;
    font-size: 0.85rem;
    opacity: 0.75;
  }
  @keyframes logo-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
}
@media (prefers-reduced-motion: reduce) {
  .logo-track {
    animation: none;
  }
  .logo-container {
    overflow-x: auto;
  }
}
</style>

<style>
/* Hack until createGlobalStyles comes to vue-styled-components.
   html carries only the flat fallback colour now: the theme
   gradient moved to the shell's fixed .page-background layer
   (App.vue), because a gradient painted on html sizes itself to
   the whole document and shifted between pages of different
   heights. */
html {
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
