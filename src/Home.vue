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
      <section class="services-section" aria-label="Services">
        <p class="services-line">Design · Video editing · Motion graphics · Social</p>
      </section>
      <card
        v-for="(product, index) in products.featured" :key="index"
        v-bind:name="product.name"
        v-bind:medium="product.medium"
        v-bind:summary="product.summary"
        v-bind:copy="product.copy"
        v-bind:links="product.links"
        v-bind:images="product.images"
        v-bind:autoplay-ms="product.autoplayMs"
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
                v-bind:width="logo.width"
                v-bind:height="logo.height"
              />
            </div>
            <div class="logo-set" aria-hidden="true" inert>
              <logo-card
                v-for="(logo, index) in logoSection.logos && logoSection.logos.slice(0,3)" :key="'dup-' + index"
                v-bind:src="logo.src"
                v-bind:url="logo.url"
                v-bind:alt="logo.alt"
                v-bind:width="logo.width"
                v-bind:height="logo.height"
              />
            </div>
          </div>
        </div>
        <p class="logo-list-text"><template v-for="(logo, i) in (logoSection.logos || []).slice(0, 3)" :key="logo.alt"><span class="logo-list-name">{{ logo.alt }}</span><span v-if="i < (logoSection.logos || []).slice(0, 3).length - 1" class="logo-list-sep" aria-hidden="true"> · </span></template></p>
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

/* The services line is its own section (Mark's call,
   2026-10-30), and it lands above the first card (his
   correction the same night): the card column's first row,
   drawn into the hero-to-cards joint by the column's own
   overlap, centred over the card's measure — all caps, the
   eyebrow tracking, and the quiet treatment it had when it
   lived in the hero. */
.services-section {
  width: 100%;
  max-width: 980px;
  margin: 0 auto 1.25rem;
  text-align: center;
}

/* At desktop widths the line's placement is the hero's
   centred instance instead (Hero.vue): the full-height
   stage puts this row far below the CTAs rather than
   between them and the card. */
@media (min-width: 61.25rem) {
  .services-section {
    display: none;
  }
}

.services-line {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}
@media screen and (max-width: 61.25rem) {
  .card-container {
    /* The gutter lives on the container, not on each card
       (2026-10-30): the fluid pass took the cards to width 100%
       with nothing at the sides, so on a phone they ran edge to
       edge. The site gutter insets the major cards, the minor
       cards and the logo strip together, under their own caps.
       One hero-to-cards joint at every width (the spacing
       system, 2026-10-30): the base -5.25rem overlap stands
       alone now — the narrower -6.5rem step that made small
       phones flush is gone, so the joint reveals one gutter
       everywhere. */
    padding-inline: var(--gutter);
  }
}

.minor-card-container {
  margin: auto;
  /* 2.5rem (the spacing system, 2026-10-30): a calmer
     approach to the logo section than the old 80px. */
  margin-bottom: 2.5rem;
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
  /* One owner per gap (the spacing system, 2026-10-30) —
     and the owner is THIS rule: it is the one the bundle's
     cascade actually applies to the card roots (the card's
     own margin-bottom in MinorCard.vue loses to it), so the
     stack rate lives here, as a bottom margin only. An
     earlier version of this pass zeroed these margins
     expecting the card's own to carry the gap — the cards
     rendered flush, no gap at all (Mark's report). The
     nth-child rules carry the same value: their higher
     specificity would otherwise override the bottom margin
     on the first and third cards. */
  .minor-card-container > * {
    margin: 0 0 var(--stack-gap);
  }
  .minor-card-container > *:nth-child(3n+1) {
    margin: 0 0 var(--stack-gap);
  }
  .minor-card-container > *:nth-child(3n+0) {
    margin: 0 0 var(--stack-gap);
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

/* On phones the marquee keeps rotating (Mark's correction,
   2026-10-30: his vertical call was about the text line, not
   the marks — an earlier pass stacked the logos themselves
   and retired the marquee, which was the wrong read). What
   stacks is the exact-list line beneath: one name per line,
   the separators retired. */
@media screen and (max-width: 40rem) {
  .logo-list-name {
    display: block;
  }
  .logo-list-sep {
    display: none;
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
