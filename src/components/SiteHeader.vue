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
        aria-controls="theme-switch"
        @click="open = !open"
      >
        <span class="nav-toggle-label">{{ open ? 'Close' : 'Menu' }}</span>
      </button>

      <nav id="primary-nav" class="primary-nav" aria-label="Primary">
        <router-link class="nav-link" to="/"><span class="nav-text" data-text="Home">Home</span></router-link>
        <router-link class="nav-link" to="/about"><span class="nav-text" data-text="About">About</span></router-link>
        <router-link class="nav-link" to="/videos"><span class="nav-text" data-text="Videos">Videos</span></router-link>
        <router-link class="nav-link" to="/contact"><span class="nav-text" data-text="Contact">Contact</span></router-link>
      </nav>

      <div id="theme-switch" class="switch-wrap" :class="{ 'is-open': open }">
        <LightToggle><span class="theme-toggle-label">{{ isDark ? 'Dark' : 'Light' }} mode</span></LightToggle>
      </div>
    </div>
  </header>
</template>

<script>
import { localStore } from '../theme.js'
import LightToggle from './LightToggle.vue'

// The site header. Replaces the three bare router-links that App.vue
// used to render: a real <header> landmark with the brand, the primary
// nav (active route shown as a pill via router-link-exact-active), and
// the theme toggle that used to float at the bottom of every view.
// Sticky, with a translucent backdrop blur over the theme background
// colour and a hairline shadow once the page has scrolled. On small
// screens the brand leaves the bar (the name is on the pages anyway),
// the full nav sits inline, and the Menu text button discloses the
// theme switch instead (Mark, 2026-10-30).
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
  -webkit-backdrop-filter: blur(0.5rem) saturate(1.25);
  backdrop-filter: blur(0.5rem) saturate(1.25);
  border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
  transition: box-shadow 0.25s ease;
}

.site-header.is-scrolled {
  box-shadow: 0 0.375rem 1.5rem color-mix(in srgb, var(--main-color) 10%, transparent);
}

.header-inner {
  /* One text size for the whole bar (Mark's nav pass, 2026-10-30),
     held as a token on the bar itself: brand, links and the Menu
     button all draw from it, and weight alone carries hierarchy.
     0.95rem at the site's 18px root is ~17px in Manrope, the
     apparent size the spec's headline step intends. */
  --nav-size: 0.95rem;
  max-width: 1180px;
  margin: 0 auto;
  /* Bar height trimmed on Mark's word (2026-10-30, twice): first
     the bar's breathing room went, then the hit floor itself came
     down (see --hit). No vertical padding remains; the controls
     are the bar's height. */
  padding: 0 1.25rem;
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
  font-size: var(--nav-size);
  letter-spacing: -0.01em;
}

.primary-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--main-color);
  /* The hit floor is the shared token; padding is in em so the
     pill's proportions follow its own label if the size moves. */
  min-height: var(--hit);
  padding: 0.5em 1em;
  border-radius: 999px;
  font-size: var(--nav-size);
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
   positioning it needed when it sat at the bottom of each view. On
   desktop the switch sits in the bar right after the nav; on mobile
   the same wrapper becomes the Menu button's dropdown panel. */
.switch-wrap {
  display: flex;
  align-items: center;
  /* The switch's hit area reaches the shared floor through the
     wrapper; the switch's own visual size is unchanged (padding
     extends the hit region, not the visual). */
  min-height: var(--hit);
  margin-left: 0.35rem;
}

.switch-wrap :deep(.light-toggle) {
  margin: 0;
}

/* No hamburger iconography: on mobile the menu is a labelled pill
   that reads Menu, and Close while the panel is open. */
.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  /* One pill construction for the whole bar: the Menu button now
     wears the active link's treatment (soft fill, inset ring) at
     the shared hit floor and text size, instead of its own
     bordered dialect. */
  min-height: var(--hit);
  padding: 0.5em 1em;
  border: none;
  border-radius: 999px;
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  color: var(--main-color);
  font: inherit;
  font-size: var(--nav-size);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.nav-toggle:hover {
  background: color-mix(in srgb, var(--main-color) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 30%, transparent);
}

/* The light/dark switch is labelled on mobile only; on desktop the
   bulb stands alone in the nav row. */
.theme-toggle-label {
  display: none;
}

@media (max-width: 40rem) {
  /* The brand leaves the mobile bar — the name is on the pages
     anyway — so the full nav can sit inline, with the Menu text
     button at the right end for the theme switch (Mark, 2026-10-30). */
  .brand {
    display: none;
  }

  .header-inner {
    --nav-size: 0.875rem;
    padding-inline: 0.9rem;
    gap: 0.5rem;
  }

  .primary-nav {
    order: 1;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.5em 0.6em;
  }

  .nav-toggle {
    display: inline-flex;
    order: 2;
    margin-left: auto;
  }

  .theme-toggle-label {
    display: inline;
    margin-left: 0.5rem;
    font-size: var(--nav-size);
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  /* The Menu panel holds only the switch now. It stays opaque like
     the old nav panel: it drops over scrolling content, and the
     translucent glass read as a transparency bug there (Mark,
     2026-10-29). The header bar above it keeps the light frost. */
  .switch-wrap {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    margin: 0;
    padding: 0.6rem 1rem 0.8rem;
    background: var(--main-background-color);
    border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
    box-shadow: 0 1rem 1.5rem rgb(0 0 0 / 0.12);
  }

  .switch-wrap.is-open {
    display: flex;
    justify-content: center;
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
