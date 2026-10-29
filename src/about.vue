<template>
  <div id="about" ref="root">
    <ThemeRoot>
      <div class="about-wrap">
        <section class="about-intro" data-reveal aria-labelledby="about-heading">
          <img src="/photo.jpg" alt="Portrait of Mark Coggins" class="author-image" />
          <div class="about-intro-text">
            <h1 id="about-heading" class="about-heading">{{ author }}</h1>
            <p class="about-role">{{ role }}</p>
          </div>
        </section>

        <section class="about-section" data-reveal aria-labelledby="facts-heading">
          <h2 id="facts-heading" class="about-section-title">At a glance</h2>
          <dl class="fact-grid">
            <div class="fact-card" v-for="fact in facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>
        </section>

        <section class="about-section" data-reveal aria-labelledby="experience-heading">
          <h2 id="experience-heading" class="about-section-title">Experience</h2>
          <dl class="experience-list">
            <div class="experience-item" v-for="item in experience" :key="item.label">
              <dt>{{ item.label }}</dt>
              <dd>{{ item.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
      <foot v-bind:author="author" v-bind:footer="footer" />
    </ThemeRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Foot from './components/Foot.vue'
import ThemeRoot from './components/ThemeRoot.vue'
import { useReveal } from './composables/useReveal.js'

import baseData from './data/2fixtures.ts'

// The About page, reorganised. It used to render the Home hero with the
// page's facts as one pre-wrap text blob; it is now its own page: an
// intro with the portrait, a facts grid, and an experience list, all
// from the structured data in 2fixtures.ts. The theme toggle that used
// to be pasted into this view lives in the SiteHeader now.
const { author, role, facts, experience, footer } = baseData

const root = ref(null)
useReveal(root)
</script>

<style>
/* Hack until createGlobalStyles comes to vue-styled-components */
html {
  background: var(--main-background-color);
  background-color: var(--fallback-background-color);
}

body {
  color: var(--main-color);
}

a {
  color: var(--link-color);
}
</style>

<style scoped>
.about-wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 3rem 1.25rem 1rem;
}

.about-intro {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.author-image {
  display: block;
  border-radius: 50%;
  width: min(220px, 55vw);
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
}

.about-heading {
  font-size: clamp(2.2rem, 6vw, 3.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.35rem;
}

.about-role {
  margin: 0;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.7;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section-title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 1.1rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid color-mix(in srgb, var(--main-color) 14%, transparent);
}

.fact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 1rem;
  margin: 0;
}

.fact-card {
  padding: 1.1rem 1.2rem;
  border-radius: 16px;
  background: color-mix(in srgb, var(--main-color) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--main-color) 9%, transparent);
}

.fact-card dt,
.experience-item dt {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  opacity: 0.65;
  margin-bottom: 0.45rem;
}

.fact-card dd,
.experience-item dd {
  margin: 0;
  line-height: 1.5;
}

.experience-list {
  display: grid;
  gap: 1rem;
  margin: 0;
}

.experience-item {
  padding: 1.1rem 1.2rem;
  border-radius: 16px;
  background: color-mix(in srgb, var(--main-color) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--main-color) 9%, transparent);
}

[data-reveal] {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

@media (max-width: 640px) {
  .about-intro {
    flex-direction: column;
    text-align: center;
    gap: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
