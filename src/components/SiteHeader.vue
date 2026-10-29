<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="Mark Coggins — home">
        <span class="brand-name">Mark Coggins</span>
      </router-link>

      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="primary-nav"
        aria-label="Toggle navigation"
        @click="open = !open"
      >
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>

      <nav id="primary-nav" class="primary-nav" :class="{ 'is-open': open }" aria-label="Primary">
        <router-link class="nav-link" to="/" @click="open = false">Home</router-link>
        <router-link class="nav-link" to="/about" @click="open = false">About</router-link>
        <router-link class="nav-link" to="/contact" @click="open = false">Contact</router-link>
        <LightToggle><span>{{ isDark ? '💡' : '💡' }}</span></LightToggle>
      </nav>
    </div>
  </header>
</template>

<script>
import { localStore } from '../theme.js'
import LightToggle from './LightToggle.vue'

// The site header. Replaces the three bare router-links that App.vue
// used to render: a real <header> landmark with the brand, the primary
// nav (active route shown as a pill via router-link-exact-active), the
// theme toggle that used to float at the bottom of every view, and a
// disclosure button for small screens. Sticky, with a translucent
// backdrop blur over the theme background colour and a hairline shadow
// once the page has scrolled.
export default {
  name: 'SiteHeader',
  components: {
    LightToggle
  },
  data: () => ({
    open: false,
    scrolled: false
  }),
  computed: {
    isDark() {
      return localStore.dark
    }
  },
  mounted() {
    this.onScroll = () => {
      this.scrolled = window.scrollY > 8
    }
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  watch: {
    $route() {
      this.open = false
    }
  }
}
</script>

<style scoped>
/* Unit rules for this header: font sizes and spacing in rem, letter
   tracking in em (it scales with the text it spaces), and px reserved
   for hairline borders only. */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: color-mix(in srgb, var(--main-background-color) 82%, transparent);
  -webkit-backdrop-filter: blur(14px) saturate(1.5);
  backdrop-filter: blur(14px) saturate(1.5);
  border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
  transition: box-shadow 0.25s ease;
}

.site-header.is-scrolled {
  box-shadow: 0 0.375rem 1.5rem color-mix(in srgb, var(--main-color) 10%, transparent);
}

.header-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.65rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  margin-right: auto;
  color: var(--main-color);
}

.brand-name {
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
}

.primary-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.nav-link {
  color: var(--main-color);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

.nav-link.router-link-exact-active {
  background: color-mix(in srgb, var(--main-color) 14%, transparent);
  color: var(--main-color);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 28%, transparent);
}

/* The theme toggle lives in the header now; undo the sticky/float
   positioning it needed when it sat at the bottom of each view. */
.primary-nav :deep(.light-toggle) {
  position: static;
  float: none;
  margin: 0 0 0 0.35rem;
  font-size: 1.25rem;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 0.3125rem;
  width: 2.625rem;
  height: 2.625rem;
  padding: 0.5625rem;
  border: 0;
  border-radius: 0.625rem;
  background: transparent;
  cursor: pointer;
}

.nav-toggle:hover {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

.nav-toggle-bar {
  display: block;
  height: 0.125rem;
  border-radius: 0.125rem;
  background: var(--main-color);
  transition: transform 0.25s ease, opacity 0.2s ease;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(1) {
  transform: translateY(0.4375rem) rotate(45deg);
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(2) {
  opacity: 0;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-bar:nth-child(3) {
  transform: translateY(-0.4375rem) rotate(-45deg);
}

@media (max-width: 40rem) {
  .nav-toggle {
    display: flex;
  }

  .primary-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.15rem;
    padding: 0.6rem 1rem 0.9rem;
    background: color-mix(in srgb, var(--main-background-color) 94%, transparent);
    -webkit-backdrop-filter: blur(14px) saturate(1.5);
    backdrop-filter: blur(14px) saturate(1.5);
    border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
  }

  .primary-nav.is-open {
    display: flex;
  }

  .nav-link {
    padding: 0.7rem 0.9rem;
  }

  .primary-nav :deep(.light-toggle) {
    align-self: flex-start;
    margin: 0.3rem 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle-bar {
    transition: none;
  }
}
</style>
