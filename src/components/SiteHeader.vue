<template>
  <header class="site-header lg-glass" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="Mark Coggins — home">
        <span class="brand-name">Mark Coggins</span>
      </router-link>

      <button
        type="button"
        class="nav-toggle"
        :aria-expanded="open ? 'true' : 'false'"
        aria-controls="primary-nav"
        @click="open = !open"
      >
        <span class="nav-toggle-label">{{ open ? 'Close' : 'Menu' }}</span>
      </button>

      <nav id="primary-nav" class="primary-nav" :class="{ 'is-open': open }" aria-label="Primary">
        <router-link class="nav-link" to="/" @click="open = false"><span class="nav-text" data-text="Home">Home</span></router-link>
        <router-link class="nav-link" to="/about" @click="open = false"><span class="nav-text" data-text="About">About</span></router-link>
        <router-link class="nav-link" to="/contact" @click="open = false"><span class="nav-text" data-text="Contact">Contact</span></router-link>
        <LightToggle><span class="theme-toggle-label">{{ isDark ? 'Dark' : 'Light' }} mode</span></LightToggle>
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
  /* Liquid Glass experiment (branch feat/liquid-glass): the surface
     itself — fill, backdrop blur/saturate, edge, shadow — comes from
     the library's .lg-glass on the header element; the hairline
     bottom border stays as the site's own divider. */
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--main-color);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.95rem;
  line-height: 1.25;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* The label carries a hidden bold twin (::after, height 0) so every
   link is always exactly as wide as its bold state. When the active
   page bolds or the hover pill appears, nothing reflows: the pill is
   the same size in every state and the text sits centred in it. */
.nav-text {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.nav-text::after {
  content: attr(data-text);
  font-weight: 700;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  pointer-events: none;
}

.nav-link:hover {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

/* The current page is carried by the bold text. The pill itself sits
   faded and only comes fully forward on hover or press. */
.nav-link.router-link-exact-active {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  color: var(--main-color);
  font-weight: 700;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease;
}

.nav-link.router-link-exact-active:hover,
.nav-link.router-link-exact-active:active {
  background: color-mix(in srgb, var(--main-color) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 30%, transparent);
}

/* The theme toggle lives in the header now; undo the sticky/float
   positioning it needed when it sat at the bottom of each view. */
.primary-nav :deep(.light-toggle) {
  margin: 0 0 0 0.35rem;
}

/* No hamburger iconography: on mobile the menu is a labelled pill
   that reads Menu, and Close while the panel is open. */
.nav-toggle {
  display: none;
  align-items: center;
  padding: 0.45rem 0.95rem;
  border: 1px solid color-mix(in srgb, var(--main-color) 22%, transparent);
  border-radius: 999px;
  background: transparent;
  color: var(--main-color);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-toggle:hover {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

/* The light/dark switch is labelled on mobile only; on desktop the
   bulb stands alone in the nav row. */
.theme-toggle-label {
  display: none;
}

@media (max-width: 40rem) {
  .nav-toggle {
    display: inline-flex;
  }

  .theme-toggle-label {
    display: inline;
    margin-left: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.01em;
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
    /* The open panel is opaque on mobile: it drops over scrolling
       content, and the translucent glass it had before read as a
       transparency bug there (Mark, 2026-10-29). The header bar above
       it keeps the light frost. */
    background: var(--main-background-color);
    border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
    box-shadow: 0 1rem 1.5rem rgb(0 0 0 / 0.12);
  }

  .primary-nav.is-open {
    display: flex;
  }

  .nav-link {
    padding: 0.7rem 0.9rem;
  }

  /* The switch sits centred in the mobile menu list. */
  .primary-nav :deep(.light-toggle) {
    align-self: center;
    margin: 0.45rem auto 0.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle {
    transition: none;
  }
}
</style>
