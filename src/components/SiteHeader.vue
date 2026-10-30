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
  /* At rest the links are spaced by their text: a whisper of
     inline padding and the row reads as words, not buttons.
     When a link is hovered, focused or current, its pill grows
     to the full hitbox padding and the row shifts to make room
     (Mark's feature, 2026-10-30) — the padding transition below
     is what makes the shift glide instead of jump. */
  padding: 0.45rem 0.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
  line-height: 1.25;
  transition: background-color 0.2s ease, color 0.2s ease, padding 0.25s ease;
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

/* The hitbox states: hover and keyboard focus grow the pill to
   its full width, and the current page's link — whose button is
   always showing — holds the full hitbox at rest too. */
.nav-link:hover,
.nav-link:focus-visible,
.nav-link.router-link-exact-active {
  padding-inline: 0.9rem;
}

/* The current page is carried by the bold text. The pill itself sits
   faded and only comes fully forward on hover or press. */
.nav-link.router-link-exact-active {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  color: var(--main-color);
  font-weight: 700;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease, padding 0.25s ease;
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
  padding: 0.45rem 0.95rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--main-color);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.25s ease;
}

.nav-toggle:hover {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

/* Built like the nav links it sits beside (Mark's call,
   2026-10-30: the outlined text button read as a leftover next
   to the new pills): no border, the links' hover fill, and while
   its panel is open it wears the current link's treatment — the
   soft fill with the inset ring. */
.nav-toggle[aria-expanded="true"] {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
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
    padding-inline: 0.9rem;
    gap: 0.5rem;
  }

  .primary-nav {
    order: 1;
    gap: 0.1rem;
    /* The Menu button takes the lefthand side (Mark's call,
       2026-10-30), so the links shift to the right end. */
    margin-left: auto;
  }

  .nav-link {
    padding: 0.4rem 0.15rem;
    font-size: 0.88rem;
  }

  .nav-link:hover,
  .nav-link:focus-visible,
  .nav-link.router-link-exact-active {
    padding-inline: 0.5rem;
  }

  .nav-toggle {
    display: inline-flex;
    order: 0;
    /* The mobile links' own sizes, at their full hitbox: the
       Menu button is always a visible button, so it holds the
       padding the links grow into on hover. */
    padding: 0.4rem 0.5rem;
    font-size: 0.88rem;
  }

  .theme-toggle-label {
    display: inline;
    margin-left: 0.5rem;
    font-size: 0.95rem;
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
    /* Drops from under the Menu button, which sits on the left
       now, so the panel anchors left and its bordered edge is
       the right one. */
    left: 0;
    margin: 0;
    padding: 0.6rem 1rem 0.8rem;
    background: var(--main-background-color);
    border-bottom: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--main-color) 10%, transparent);
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
