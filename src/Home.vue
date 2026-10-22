<template>
  <div id="app">
  <ThemeRoot>
    <hero
      v-bind:author="author"
      v-bind:subtitle="hero.subtitle"
      v-bind:description="hero.description"
      v-bind:cta="hero.cta"
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
          <logo-card
            v-for="(logo, index) in logoSection.logos && logoSection.logos.slice(0,3)" :key="index"
            v-bind:src="logo.src"
            v-bind:url="logo.url"
            v-bind:alt="logo.alt"
          />
        </div>
      </div>
    </div>
    <foot v-bind:author="author" v-bind:footer="footer" />
    <LightToggle><span v-if="!isDark" >💡</span><span v-if="isDark">💡</span></LightToggle>
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
import LightToggle from './components/LightToggle.vue'
import { localStore } from './theme.js'

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
    LightToggle,
    LogoCard
  },
  computed: {
    isDark() {
      return localStore.dark
    }
  },
  data: () => ({
    ...baseData
  })
}
</script>

<style scoped>
.card-container {
  margin-top: -60px;
}
@media screen and (max-width: 980px) {
  .card-container {
    margin-top: -48px;
  }
}

.minor-card-container {
  margin: auto;
  margin-bottom: 80px;
  width: 980px;
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
    width: 600px;
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
    width: 360px;
    flex-direction: column;
  }
}

.logo-section-container {
  margin: auto;
  text-align: center;
  width: 980px;
}
@media screen and (max-width: 980px) {
  .logo-section-container {
    width: 600px;
    flex-direction: column;
  }
}
@media screen and (max-width: 600px) {
  .logo-section-container {
    width: 360px;
    flex-direction: column;
  }
}

.logo-container {
  justify-content: center;
  margin: auto;
  margin-top: 20px;
  width: 980px;
  display: flex;
}
@media screen and (max-width: 980px) {
  .logo-container {
    width: 600px;
    flex-direction: column;
  }
}
@media screen and (max-width: 600px) {
  .logo-container {
    width: 360px;
    flex-direction: column;
  }
}
</style>

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
