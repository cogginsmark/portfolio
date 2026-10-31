<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner">
      <router-link to="/" class="brand" aria-label="Mark Coggins — home">
        <span class="brand-name">Mark Coggins</span>
      </router-link>

      <div class="mobile-menu-wrap">
        <button
          type="button"
          class="nav-toggle"
          :aria-expanded="open ? 'true' : 'false'"
          aria-controls="menu-panel"
          @click="open = !open"
        >
          <span class="nav-toggle-label">{{ open ? 'Close' : 'Menu' }}</span>
        </button>

        <div id="menu-panel" class="switch-wrap" :class="{ 'is-open': open }">
          <LightToggle><span class="theme-toggle-label">{{ isDark ? 'Dark' : 'Light' }} mode</span></LightToggle>

          <nav class="panel-links" aria-label="Quick actions" @click="open = false">
            <a class="panel-link" href="/cv.pdf" target="_blank" rel="noopener"><span>Resume / CV</span></a>
            <a class="panel-link" :href="emailUrl"><span>Email</span></a>
            <a v-for="link in socialLinks" :key="link.name" class="panel-link" :href="link.url" target="_blank" rel="noopener"><span>{{ link.name }}</span></a>
          </nav>
        </div>
      </div>

      <nav id="primary-nav" class="primary-nav" aria-label="Primary">
        <router-link class="nav-link" to="/"><span class="nav-text" data-text="Home">Home</span></router-link>
        <router-link class="nav-link" to="/about"><span class="nav-text" data-text="About">About</span></router-link>
        <router-link class="nav-link" to="/videos"><span class="nav-text" data-text="Videos">Videos</span></router-link>
        <router-link class="nav-link" to="/contact"><span class="nav-text" data-text="Contact">Contact</span></router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { localStore } from '../theme.js'
import LightToggle from './LightToggle.vue'
import homeData from '../data/fixtures'

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
    },
    // The Menu panel's quick actions draw on the same link
    // data as the footer (2026-10-30), so the two never drift.
    emailUrl() {
      const email = homeData.footer.links.find((link) => link.name === 'Email')
      return email ? email.url : 'mailto:cogginsmark@icloud.com'
    },
    socialLinks() {
      const order = ['Github', 'Linkedin', 'Medium']
      return order
        .map((name) => homeData.footer.links.find((link) => link.name === name))
        .filter(Boolean)
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
  -webkit-tap-highlight-color: transparent;
  border-radius: 999px;
  font-size: 0.95rem;
  line-height: 1.25;
  transition: background-color 0.2s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
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

/* The hitbox states: keyboard focus grows the pill to its full
   width, and the current page's link — whose button is always
   showing — holds the full hitbox at rest too. Hover grows it
   as well, but only where hover exists: those rules live in
   the (hover: hover) block below, because on touch a tap was
   flashing the hover pill for a frame before the route changed
   (Mark's report, 2026-10-30). */
.nav-link:focus-visible,
.nav-link.router-link-exact-active {
  padding-inline: 0.9rem;
}

@media (hover: hover) {
  .nav-link:hover {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
    padding-inline: 0.9rem;
  }

  .nav-link.router-link-exact-active:hover {
    background: color-mix(in srgb, var(--main-color) 16%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 30%, transparent);
  }

  .nav-toggle:hover {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
  }
}

@media (max-width: 40rem) and (hover: hover) {
  .nav-link:hover {
    padding-inline: 0.5rem;
  }
}

@media (hover: hover) {
  /* A very short beat before the hitbox gives back its growth
     (Mark's call, 2026-10-30): leaving a link, the pill holds
     its full width for a moment, then returns to its text
     spacing. The delay rides on the resting state only, so
     growing on hover stays instant — and it touches the
     padding alone, the third entry in the links' transition
     list. */
  .nav-link:not(:hover):not(:focus-visible):not(.router-link-exact-active) {
    transition-delay: 0s, 0s, 0.12s, 0s;
  }
}

/* The current page is carried by the bold text. The pill itself sits
   faded and only comes fully forward on hover or press. */
.nav-link.router-link-exact-active {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  color: var(--main-color);
  font-weight: 700;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
}

.nav-link.router-link-exact-active:active {
  background: color-mix(in srgb, var(--main-color) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 30%, transparent);
}

/* The Menu button and the theme switch share a wrapper so the
   mobile dropdown can hook to the button itself (2026-10-30):
   the wrapper is ordered after the nav on desktop (where the
   button is hidden and the switch sits in the bar) and before
   it on mobile, where it carries the positioning the panel
   anchors to. */
.mobile-menu-wrap {
  display: flex;
  align-items: center;
  order: 2;
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

.switch-wrap :deep(.theme-pill) {
  margin: 0;
}

/* The panel's quick-action links exist only in the mobile
   dropdown; the desktop bar's switch wrap never shows them. */
.panel-links {
  display: none;
}

/* No hamburger iconography: on mobile the menu is a labelled pill
   that reads Menu, and Close while the panel is open. */
.nav-toggle {
  display: none;
  align-items: center;
  padding: 0.45rem 0.95rem;
  -webkit-tap-highlight-color: transparent;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--main-color);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.25s ease, padding 0.25s ease;
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
    /* Trying the nav items left-aligned (Mark's call,
       2026-10-30): they sit on the bar's left padding line;
       the Menu item stays floated right, out of the flow —
       see .mobile-menu-wrap below. */
    justify-content: flex-start;
  }

  .primary-nav {
    order: 1;
    gap: 0.1rem;
    /* Right of the Menu button in the bar's own flow (Mark's
       correction, 2026-10-30): the links sit beside the Menu,
       not pushed out to the site's right edge. */
  }

  .nav-link {
    /* Sizes swapped with the Menu item (Mark's spec,
       2026-10-30): the nav items take the full hitbox padding
       the Menu button used to hold, at rest. */
    padding: 0.4rem 0.5rem;
    font-size: 0.88rem;
  }

  .nav-link:focus-visible,
  .nav-link.router-link-exact-active {
    padding-inline: 0.5rem;
  }

  /* No hover on a phone (Mark's call, 2026-10-30): the active
     tab makes its change as one animation when it becomes
     current — the variable font's weight and the hitbox growth
     running together — instead of arriving pre-grown. The
     hidden bold twin already holds the text's width, so the
     motion is pure padding and weight. */
  .nav-link.router-link-exact-active {
    animation: nav-active-in 0.3s ease;
    /* The keyframes own the weight and the last fraction of
       padding while the tab becomes current, so the general
       transition stays out of those here: run together,
       animation and transition recalculated against each other
       and the change stuttered (Mark's report, 2026-10-30).
       The spacing is weight-proof — the hidden bold twin sizes
       every link at the active weight from the start. */
    transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease;
  }

  /* On mobile the bar's two alignments separate (Mark's spec,
     2026-10-30): the nav items centre on their own, and the
     Menu item floats to the side — out of the flow, pinned to
     the bar's right edge on its padding line and centred
     vertically (floated right at his word). The wrapper stays
     the panel's hook: positioned here, it carries the dropdown
     with the button. */
  .mobile-menu-wrap {
    position: absolute;
    right: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .nav-toggle {
    display: inline-flex;
    /* The other half of the swap (2026-10-30): the Menu item
       takes the text spacing the nav items used to rest at. */
    padding: 0.4rem 0.15rem;
    font-size: 0.88rem;
  }

  /* Open, the button reads Close — and expands its hotbox to
     the full hitbox (Mark's call, 2026-10-30): the wider word
     gets the nav items' own padding to sit in, and the target
     grows with it. The base rule's transition animates the
     growth. */
  .nav-toggle[aria-expanded="true"] {
    padding-inline: 0.5rem;
  }

  .theme-toggle-label {
    display: inline;
    /* The pill's own gap spaces the label now (2026-10-30):
       the margin that once separated it from the switch would
       double the space. */
    margin-left: 0;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    /* One line in the popup (Mark's call, 2026-10-30): "Light
       mode" never wraps; the panel sizes to fit it. */
    white-space: nowrap;
  }

  /* In the panel the toggle speaks in its long form — the
     slot's "Light mode / Dark mode" — so the pill's own short
     word stands down there. */
  .switch-wrap :deep(.theme-pill-word) {
    display: none;
  }

  /* The Menu panel holds only the switch now. It stays opaque like
     the old nav panel: it drops over scrolling content, and the
     translucent glass read as a transparency bug there (Mark,
     2026-10-29). The header bar above it keeps the light frost. */
  .switch-wrap {
    display: none;
    position: absolute;
    /* A floating pill, hooked to the Menu button (Mark's
       calls, 2026-10-30): the background behind the light/dark
       mode is a pill, not a rounded rectangle. It anchors to
       the button's own wrapper, so it drops from directly under
       the button — its right edge on the button's right edge,
       now that the Menu floats right — instead of floating
       loose in the header. One border all around, a solid
       surface — the theme's fallback colour — no gradient. The
       drop clears the bar by the same half rem as before: the
       extra .65 covers the stretch from the centred wrapper's
       bottom edge down to the bar's bottom, which the wrapper
       does not span. */
    top: calc(100% + 0.5rem + 0.65rem);
    right: 0;
    left: auto;
    margin: 0;
    min-width: 12.5rem;
    /* No container card any more (Mark's call, 2026-10-30):
       the panel is just the stack — each item is separated
       and carries its own pill. */
    padding: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
  }

  .switch-wrap.is-open {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  /* The quick actions (Mark's pick, 2026-10-30): Resume / CV,
     Email, Github, Linkedin, Medium. No icons in the menu and
     every item its own separated pill — words alone, centred,
     on the panel's solid surface with its hairline ring. Their
     data is the footer's, so the two agree. */
  .panel-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .panel-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent);
    color: var(--main-color);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: hover) {
    .panel-link:hover {
      background: color-mix(in srgb, var(--main-color) 8%, var(--fallback-background-color));
    }
  }

  /* The theme toggle wears the same separated pill in the
     panel, its icon stood down with the rest. */
  .switch-wrap :deep(.theme-pill) {
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent);
    justify-content: center;
  }

  .switch-wrap :deep(.theme-pill i) {
    display: none;
  }
}

@keyframes nav-active-in {
  /* The growth is back, kept subtle (Mark's call, 2026-10-30):
     since the size swap the links rest at their full hitbox,
     so the incoming tab dips a touch under it and grows the
     last fraction into place alongside the weight. */
  from {
    padding-inline: 0.42rem;
    font-weight: 400;
  }
  to {
    padding-inline: 0.5rem;
    font-weight: 700;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle {
    transition: none;
  }

  .nav-link.router-link-exact-active {
    animation: none;
  }
}
</style>
