<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'nav-centered': navCentered }">
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
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <span v-if="!navCentered" class="nav-toggle-label">{{ open ? 'Close' : 'Menu' }}</span>
          <span v-else class="nav-toggle-glyph" aria-hidden="true">more_vert</span>
        </button>

        <div id="menu-panel" class="switch-wrap" :class="{ 'is-open': open }">
          <LightToggle><span class="theme-toggle-label">{{ isDark ? 'Dark' : 'Light' }} mode</span></LightToggle>

          <nav class="panel-links" aria-label="Quick actions" @click="open = false">
            <a class="panel-link" href="/cv.pdf" target="_blank" rel="noopener"><span>Resume / CV</span><i class="fas fa-arrow-down" aria-hidden="true"></i></a>
            <a class="panel-link" :href="emailUrl"><span>Email</span><i class="fa fa-envelope" aria-hidden="true"></i></a>
            <a v-for="link in socialLinks" :key="link.name" class="panel-link" :href="link.url" target="_blank" rel="noopener"><span>{{ link.name }}</span><i :class="link.fa" aria-hidden="true"></i></a>
          </nav>
        </div>
      </div>

      <nav id="primary-nav" class="primary-nav" aria-label="Primary" @click="markNavTapped">
        <router-link class="nav-link" to="/"><span class="nav-text" data-text="Home">Home</span></router-link>
        <router-link class="nav-link" to="/about"><span class="nav-text" data-text="About">About</span></router-link>
        <router-link class="nav-link" to="/videos"><span class="nav-text" data-text="Videos">Videos</span></router-link>
        <router-link class="nav-link" to="/contact"><span class="nav-text" data-text="Contact">Contact</span></router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { localStore, navStore } from '../theme.js'
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
    navCentered() {
      return navStore.centered
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
  methods: {
    // A tap on a nav item flips the mobile header into its
    // centred layout (the navStore comment in theme.js carries
    // the model). Desktop clicks leave it alone — the layout
    // it drives exists only on small screens.
    markNavTapped(e) {
      if (!window.matchMedia('(max-width: 40rem)').matches) return
      // Home is the layout's home (Mark's call, 2026-10-30):
      // tapping through to it restores the as-is alignment and
      // expands the Menu text again, rather than centring.
      const a = e && e.target && e.target.closest ? e.target.closest('a') : null
      if (a && new URL(a.href).pathname === '/') {
        navStore.centered = false
        return
      }
      if (navStore.centered) return
      this.measureNavShift()
      navStore.centered = true
    },
    // The centred layout moves the nav group by transform —
    // justify-content cannot animate, so the distance to the
    // centre is measured and ridden as a variable (Mark's
    // call, 2026-10-30: the transition should be smooth).
    measureNavShift() {
      const nav = document.getElementById('primary-nav')
      const inner = nav && nav.closest('.header-inner')
      if (!nav || !inner) return
      const navRect = nav.getBoundingClientRect()
      const innerRect = inner.getBoundingClientRect()
      const shift = (innerRect.width - navRect.width) / 2 - (navRect.left - innerRect.left)
      nav.style.setProperty('--nav-shift', shift.toFixed(1) + 'px')
    }
  },
  mounted() {
    this.onScroll = () => {
      this.scrolled = window.scrollY > 8
    }
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onResize = () => {
      if (navStore.centered) this.measureNavShift()
    }
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    $route() {
      this.open = false
      // Arriving home by any route — the brand, a back swipe —
      // restores the as-is layout too, not just the Home item.
      if (this.$route.path === '/') {
        navStore.centered = false
      }
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
    /* Text-defined at rest (Mark's call, 2026-10-30: reactive
       again): the items hug their words, and state changes —
       becoming current, focus — grow the pill through the
       links' own padding and weight transitions. The two-state
       promotion tried earlier today is gone. */
    padding: 0.4rem 0.42rem;
    font-size: 0.88rem;
  }

  .nav-link:focus-visible {
    padding-inline: 0.5rem;
  }

  /* The current item: full hitbox, reached reactively — the
     base transition animates the padding and the variable
     weight together as the item becomes current, the same
     glide the desktop bar has always had. */
  .nav-link.router-link-exact-active {
    padding-inline: 0.5rem;
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
    /* Text spacing at rest; opening grows it (below). */
    padding: 0.4rem 0.15rem;
    font-size: 0.88rem;
  }

  /* Open, the button reads Close — and expands its hotbox to
     the full hitbox (Mark's call, 2026-10-30, restored after
     the constant-box detour: the menu-to-Close growth was
     better): the wider word gets the nav items' own padding
     to sit in, and the target grows with it. The base rule's
     transition animates the growth. */
  .nav-toggle[aria-expanded="true"] {
    padding-inline: 0.5rem;
  }

  /* The centred layout (Mark's model, 2026-10-30): once a nav
     item has been tapped, the items centre in the bar and the
     Menu text collapses into a stacked three-circle glyph.
     The centring rides a measured transform — justify-content
     cannot animate, and the transition should be smooth — and
     the glyph sits at the button's right edge, on the menu
     block's own right line below it. */
  .primary-nav {
    transition: transform 0.4s ease;
  }

  .site-header.nav-centered .primary-nav {
    transform: translateX(var(--nav-shift, 0px));
  }

  .site-header.nav-centered .nav-toggle,
  .site-header.nav-centered .nav-toggle[aria-expanded="true"] {
    padding: 0.4rem 0.6rem;
    justify-content: flex-end;
  }

  /* The glyph is a variable glyph (Mark's call, 2026-10-30):
     Material Symbols' more_vert, sharing the text's own
     weight axis — it rests at the Menu word's 500 and
     transforms to 700 while the panel is open, the axis
     animating like the carousel chevrons' does. */
  .nav-toggle-glyph {
    font-family: 'Material Symbols Rounded';
    font-size: 1.3rem;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
    transition: font-variation-settings 0.25s ease;
  }

  .nav-toggle[aria-expanded="true"] .nav-toggle-glyph {
    font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24;
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
     Email, Github, Linkedin, Medium — every item its own
     separated pill on the panel's solid surface with its
     hairline ring, text left and its icon rightmost (icons
     returned at his word after a brief icon-less pass). Their
     data is the footer's, so the two agree. */
  .panel-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .panel-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .panel-link i {
    flex: none;
    width: 1rem;
    text-align: center;
    font-size: 0.9rem;
    line-height: 1;
  }

  @media (hover: hover) {
    .panel-link:hover {
      background: color-mix(in srgb, var(--main-color) 8%, var(--fallback-background-color));
    }
  }

  /* The theme toggle wears the same separated pill in the
     panel, laid out like the links (Mark's call, 2026-10-30:
     icons back in the menu, text left, icon rightmost) — the
     row reverses so its icon lands on the right. */
  .switch-wrap :deep(.theme-pill) {
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent);
    flex-direction: row-reverse;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle,
  .primary-nav {
    transition: none;
  }
}
</style>
