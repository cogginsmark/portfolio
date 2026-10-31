<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled, 'nav-centered': navCentered, 'has-navigated': hasNavigated }">
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
          <span class="nav-toggle-stack">
            <span class="nav-toggle-label">{{ open ? 'Close' : 'Menu' }}</span>
            <span class="nav-toggle-glyph" aria-hidden="true">…</span>
          </span>
        </button>

        <div id="menu-panel" class="switch-wrap" :class="{ 'is-open': open }">
          <LightToggle />

          <nav class="panel-links" aria-label="Quick actions" @click="open = false">
            <a class="panel-link" href="/cv.pdf" target="_blank" rel="noopener"><span>Resume / CV</span><i class="fas fa-arrow-down" aria-hidden="true"></i></a>
            <a class="panel-link" :href="emailUrl"><span>Email</span><i class="fa fa-envelope" aria-hidden="true"></i></a>
            <a v-for="link in socialLinks" :key="link.name" class="panel-link" :href="link.url" target="_blank" rel="noopener"><span>{{ link.name }}</span><i :class="link.fa" aria-hidden="true"></i></a>
          </nav>
        </div>
      </div>

      <nav id="primary-nav" class="primary-nav" aria-label="Primary" @click="markNavTapped">
        <span class="nav-pill" ref="navPill" aria-hidden="true" :class="{ 'is-shown': pillShow, 'is-dim': pillDim }" :style="{ left: pillX + 'px', width: pillW + 'px' }"></span>
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
    scrolled: false,
    // The router's first route resolution (its START sentinel
    // settling onto the loaded page) fires the $route watcher
    // once at startup — that firing is not navigation, and the
    // watcher uses this flag to say so (2026-10-30 fix: with
    // the first firing counted, the active pill appeared on
    // every cold load, defeating the standing state).
    routeReady: false,
    // The travelling pill's committed geometry (its
    // animations FLIP from these values) and its light
    // state: shown once a nav item has been clicked, at
    // full strength, then dimmed to the reduced standing
    // opacity after its beat.
    pillX: 0,
    pillW: 0,
    pillShow: false,
    pillDim: false
  }),
  computed: {
    isDark() {
      return localStore.dark
    },
    navCentered() {
      return navStore.centered
    },
    hasNavigated() {
      return navStore.navigated
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
      // Navigation starts at the tap (Mark's model,
      // 2026-10-30): from here on the current item wears its
      // pill, not just its bold text.
      navStore.navigated = true
      // The pill answers the tap: it springs in at the
      // tapped item (or brightens where it stands, when the
      // tap is on the current page's own item — the route
      // watcher runs the travel when the page changes).
      this.$nextTick(() => this.updatePill(true))
      if (!window.matchMedia('(max-width: 40rem)').matches) return
      // Home is the layout's home (Mark's call, 2026-10-30):
      // tapping through to it restores the as-is alignment and
      // expands the Menu text again, rather than centring.
      const a = e && e.target && e.target.closest ? e.target.closest('a') : null
      if (a && new URL(a.href).pathname === '/') {
        this.setCentered(false)
        return
      }
      this.setCentered(true)
    },
    // FLIP the row between its two layouts (Mark's bug report,
    // 2026-10-30: the CSS-transition version was not smooth).
    // Measure where the row sits, change the layout, measure
    // again, then animate the difference away — composed over
    // the new layout's own transform, so the row starts
    // exactly where it was and glides to exactly where the
    // new layout puts it.
    setCentered(value) {
      if (navStore.centered === value) return
      const nav = document.getElementById('primary-nav')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!nav || typeof nav.animate !== 'function' || reduced) {
        navStore.centered = value
        return
      }
      const before = nav.getBoundingClientRect()
      navStore.centered = value
      this.$nextTick(() => {
        const after = nav.getBoundingClientRect()
        const dx = (before.left + before.width / 2) - (after.left + after.width / 2)
        if (!dx) return
        nav.animate(
          [
            { transform: value ? `translateX(calc(-50% + ${dx}px))` : `translateX(${dx}px)` },
            { transform: value ? 'translateX(-50%)' : 'translateX(0px)' }
          ],
          { duration: 400, easing: 'ease' }
        )
      })
    },
    updatePill(travel) {
      const nav = document.getElementById('primary-nav')
      const pill = this.$refs.navPill
      if (!nav || !pill) return
      const active = nav.querySelector('.router-link-exact-active')
      if (!navStore.navigated || !active) {
        this.pillShow = false
        return
      }
      // The pill's end state is the item's full hitbox
      // (Mark's model): the gated rule grows the current
      // item's own padding to the hitbox measure, so the
      // pill's presence moves the row's spacing — and the
      // pill is that grown box exactly. The final geometry
      // is measured with the links' transitions briefly
      // stood down, so a mid-glide padding cannot give a
      // half-grown measure.
      nav.classList.add('pill-measuring')
      const toX = active.offsetLeft
      const toW = active.offsetWidth
      nav.classList.remove('pill-measuring')
      const fromX = this.pillX
      const fromW = this.pillW
      const firstShow = !this.pillShow
      this.pillX = toX
      this.pillW = toW
      this.pillShow = true
      this.pillDim = false
      if (this.pillDimTimer) clearTimeout(this.pillDimTimer)
      this.pillDimTimer = setTimeout(() => { this.pillDim = true }, 950)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || typeof pill.animate !== 'function') return
      if (firstShow) {
        // The spring appear (Mark's call, 2026-10-30 — the
        // one the collapsed Menu icon's pill background
        // makes): the pill grows from the item's text box
        // to its full hitbox with a spring's overshoot.
        const text = active.querySelector('.nav-text')
        const startW = text ? text.offsetWidth : toW
        const startX = toX + (toW - startW) / 2
        this.$nextTick(() => {
          pill.animate(
            [
              { transform: `translateX(${startX - toX}px)`, width: `${startW}px`, opacity: 0 },
              { transform: 'translateX(0px)', width: `${toW}px`, opacity: 1 }
            ],
            { duration: 480, easing: 'cubic-bezier(0.34, 1.45, 0.64, 1)' }
          )
        })
        return
      }
      if (!travel) return
      const dist = Math.abs((toX + toW / 2) - (fromX + fromW / 2))
      if (!dist) return
      // Travel at a constant velocity (Mark's call,
      // 2026-10-30): the duration is the distance at
      // 1.1px per millisecond, clamped so a short hop
      // still reads and a full traverse never dawdles —
      // with a spring kept in the landing.
      const duration = Math.min(600, Math.max(180, dist / 1.1))
      this.$nextTick(() => {
        pill.animate(
          [
            { transform: `translateX(${fromX - toX}px)`, width: `${fromW}px` },
            { transform: 'translateX(0px)', width: `${toW}px` }
          ],
          { duration, easing: 'cubic-bezier(0.3, 1.25, 0.4, 1)' }
        )
      })
    }
  },
  mounted() {
    this.onScroll = () => {
      this.scrolled = window.scrollY > 8
    }
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    // The pill's geometry is measured from the live row:
    // keep it honest across resizes and the font's arrival.
    this.onResizePill = () => this.updatePill(false)
    window.addEventListener('resize', this.onResizePill)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.updatePill(false))
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResizePill)
    if (this.pillDimTimer) clearTimeout(this.pillDimTimer)
  },
  watch: {
    $route() {
      this.open = false
      // Any route change after the initial resolution is
      // navigation (a back swipe included): the pill follows
      // the active item, travelling to it. The first firing
      // is the router settling onto the loaded page, not a
      // navigation. The navigated state itself is set only
      // by a click on a nav item (markNavTapped) — never by
      // the route changing on its own.
      if (this.routeReady) {
        this.$nextTick(() => this.updatePill(true))
      }
      this.routeReady = true
      // Arriving home by any route — the brand, a back swipe —
      // restores the as-is layout too, not just the Home item.
      if (this.$route.path === '/') {
        this.setCentered(false)
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  /* The gap is live (below): it glides when the pill's
     presence changes it. Reduced motion stands it down
     with the rest in the block at the file's foot. */
  transition: gap 0.4s ease;
}

/* The spacing BETWEEN the items answers the pill too
   (Mark's call, 2026-10-30): while the pill is present the
   row breathes open — the gaps widen alongside the current
   item's own in-flow growth, so the whole row makes room
   for the pill, not just the item it sits under. On load,
   with no pill, the row rests at its tighter spacing. */
.site-header.has-navigated .primary-nav {
  gap: 0.6rem;
}

.nav-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--main-color);
  /* At rest the links are spaced by their text: a whisper of
     inline padding and the row reads as words, not buttons.
     The padding never changes — the current item's hitbox
     is drawn by the travelling pill underneath it (below),
     which expands to the full hitbox measure around the
     word. */
  padding: 0.45rem 0.25rem;
  -webkit-tap-highlight-color: transparent;
  border-radius: 999px;
  /* Back to the larger text (Mark's call, 2026-10-30): the
     bar's words at a full 1rem — on phones, where the root
     is 16px, that restores the size the .88rem step-down
     had taken away. */
  font-size: 1rem;
  line-height: 1.25;
  /* The background's slower rate is the fade (Mark's call,
     2026-10-30): a hovered pill arrives quickly (the hover
     rule carries its own faster transition) and fades back
     slowly once the hover is done. */
  transition: background-color 0.45s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
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
   width. The pills never expand to appear (Mark's model,
   2026-10-30): a link's padding is its padding at every
   moment, and the pill is only ever a background — the
   current item's fill and ring, nothing more. And it
   appears only after a nav item has been clicked: on load
   the current item stands as bold text alone, the first
   click on the nav sets the state, and it stays for the
   session; a reload resets it to the bold standing
   position. */
.nav-link:focus-visible {
  background: color-mix(in srgb, var(--main-color) 8%, transparent);
}

@media (hover: hover) {
  .nav-toggle:hover {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
  }
}

/* The current page is always carried by the bold text — that
   is its standing position, on load and after. */
.nav-link.router-link-exact-active {
  color: var(--main-color);
  font-weight: 700;
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
}

/* Once the pill exists (a nav item has been clicked), the
   current item takes its full hitbox padding in the flow
   (Mark's call, 2026-10-30): the pill's presence affects
   the row's spacing — the neighbours make room for it, the
   links' own transition gliding the change. The travelling
   pill underneath is exactly this grown box. The measure
   is generous, Apple-spec style (Mark's call, 2026-10-30):
   a wide capsule around the word, in the segmented-control
   spirit, not a tight highlight. */
.site-header.has-navigated .nav-link.router-link-exact-active {
  padding-inline: 1.25rem;
}

/* The row's left end holds one-sided padding at rest
   (Mark's call, 2026-10-30): with no pill under it, Home
   keeps its left padding only — that padding pins the
   word's distance from the bar's left line, and the
   spacing on to the next item is the row's gap alone.
   When the pill is Home's, the gated rule above outranks
   this and the full capsule returns. (The pill element is
   a span, so the first link is the first of its type.) */
.primary-nav > .nav-link:first-of-type {
  padding-right: 0;
}

/* Measuring the pill's target (updatePill) stands the
   links' transitions down for one synchronous read, so the
   geometry is the end state, never a mid-glide frame. The
   row's own gap glide stands down too — the item's offset
   depends on the gaps before it. */
.primary-nav.pill-measuring,
.primary-nav.pill-measuring .nav-link {
  transition: none !important;
}

/* The pill is one travelling element (Mark's model,
   2026-10-30): a single background that lives under the
   current item at its full hitbox measure. It appears only
   after a nav item has been clicked — springing in from the
   item's text box the way the collapsed Menu icon's pill
   does — and when the current page changes it travels to
   the next item, its duration set by the distance at a
   constant velocity, with a spring in the landing. At rest
   it dims to the reduced standing opacity. */
.nav-pill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, background-color 0.35s ease, box-shadow 0.35s ease;
}

.nav-pill.is-shown {
  opacity: 1;
}

.nav-pill.is-dim {
  background: color-mix(in srgb, var(--main-color) 3%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 6%, transparent);
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

/* The switch wrap is the mobile Menu panel: the toggle row
   over the quick-action links. On desktop it is not shown at
   all (the rule below) — the Background control floats at
   the page's bottom-right from App.vue instead (Mark's call,
   2026-10-30), out of the header entirely. */
.switch-wrap {
  display: flex;
  align-items: center;
  margin-left: 0.35rem;
}

@media (min-width: 40.01rem) {
  .switch-wrap {
    display: none;
  }
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

@media (max-width: 40rem) {
  /* The brand leaves the mobile bar — the name is on the pages
     anyway — so the full nav can sit inline, with the Menu text
     button at the right end for the theme switch (Mark, 2026-10-30). */
  .brand {
    display: none;
  }

  .header-inner {
    /* On the page's line (the spacing system, 2026-10-30):
       the bar's inset is the site gutter, like the body and
       the footer it frames. */
    padding-inline: var(--gutter);
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
    /* Touch-optimised and closer (Mark's calls, 2026-10-30):
       the taller padding takes each item to a comfortable
       tap height, and the inline spacing tightens to .2rem
       so the items sit closer together for the pill effect.
       The padding is constant — the pills never expand. The
       type is the bar's full 1rem again (Mark's call,
       2026-10-30) — no mobile step-down. */
    padding: 0.55rem 0.2rem;
  }

  .nav-link:focus-visible {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
  }

  /* The pill's presence moves the spacing here too: the
     current item's hitbox padding, in the flow — the wider
     Apple-spec measure, scaled to the bar. */
  .site-header.has-navigated .nav-link.router-link-exact-active {
    padding-inline: 0.75rem;
  }

  /* And the gaps between the items open with it (Mark's
     call, 2026-10-30), from the tight resting .1rem the
     pill effect wanted to a breathed .3rem. The centred
     layout holds its centre at any row width, so the row
     widens around its middle. */
  .site-header.has-navigated .primary-nav {
    gap: 0.3rem;
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
    right: var(--gutter);
    top: 50%;
    transform: translateY(-50%);
  }

  .nav-toggle {
    display: inline-flex;
    /* Text spacing at rest; opening grows it (below). The
       word matches the links' restored 1rem. The rest
       padding is right-side only (Mark's call, 2026-10-30):
       the wrap is anchored to the bar's right line, so the
       right padding pins the word's distance from the edge
       and the left carries none until the Close pill grows
       it — the mirror of Home's left-only rest padding. */
    padding: 0.55rem 0.15rem 0.55rem 0;
    font-size: 1rem;
  }

  /* Open, the button reads Close — and expands its hotbox to
     the full hitbox (Mark's call, 2026-10-30, restored after
     the constant-box detour: the menu-to-Close growth was
     better): the wider word gets the nav items' own padding
     to sit in, and the target grows with it. The base rule's
     transition animates the growth. */
  .nav-toggle[aria-expanded="true"] {
    /* The Close pill takes the nav pills' own wider measure
       (Mark's call, 2026-10-30 — the Apple-spec sweep
       includes the close pill). */
    padding-inline: 0.75rem;
  }

  /* The centred layout (Mark's model, 2026-10-30): once a nav
     item has been tapped, the items centre in the bar and the
     Menu text collapses into a stacked three-circle glyph.
     The end state is left: 50% plus translateX(-50%) — self-
     centring at any width — and the move itself is a FLIP
     animation run from setCentered (the CSS-transition
     version of this move was not smooth: Mark's bug report,
     2026-10-30). The glyph sits at the button's right edge,
     on the menu block's own right line below it. */
  .primary-nav {
    position: relative;
    left: 0;
  }

  .site-header.nav-centered .primary-nav {
    left: 50%;
    transform: translateX(-50%);
  }

  .site-header.nav-centered .nav-toggle,
  .site-header.nav-centered .nav-toggle[aria-expanded="true"] {
    /* The collapsed pill is form-fitted to the dots (Mark's
       call, 2026-10-30, superseding the full-text block):
       no min-width — the button hugs the glyph, and the
       faded word leaves the layout (below) so the stack
       sizes to the dots alone. Its inline padding is the
       panel rows' own inset — widened to 1.25rem with them
       in the Apple-spec sweep (Mark's call, 2026-10-30) —
       so the dots sit on the same right-hand line as the
       rows' icons below; the background already matched the
       rows and is untouched. The right edge does not move:
       the wrap is anchored to the gutter line, and the
       panel below keys off the same edge. */
    padding: 0.55rem 1.25rem;
    min-width: 0;
    justify-content: center;
  }

  /* The glyph is the font's own (Mark's call, 2026-10-30):
     Manrope has no vertical ellipsis — checked against the
     files Google serves — but it has the horizontal one, so
     the dots are that glyph turned a quarter turn. Being text
     in the variable font, it shares the Menu word's exact
     behaviour: it rests at weight 500 and transforms to 700
     while the panel is open, the axis animating as text. */
  /* The collapse is a morph (Mark's call, 2026-10-30): the
     word and the glyph share one stacked cell at all times,
     and centring crossfades them — the word squeezes and
     drifts toward the right edge as it fades, the dots scale
     up into its place — instead of the two swapping in a
     cut. */
  .nav-toggle-stack {
    display: inline-grid;
    position: relative;
  }

  .nav-toggle-stack > * {
    grid-area: 1 / 1;
  }

  .nav-toggle-label {
    justify-self: start;
    transform-origin: right center;
    transition: opacity 0.35s ease, transform 0.35s ease, letter-spacing 0.35s ease;
  }

  .nav-toggle-glyph {
    justify-self: end;
    font-size: 1.35rem;
    font-weight: 500;
    line-height: 1;
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
    transition: opacity 0.3s ease, transform 0.35s ease, font-weight 0.25s ease;
  }

  .site-header.nav-centered .nav-toggle-label {
    /* Out of the layout while centred, so the stack — and
       with it the form-fitted pill — sizes to the glyph
       alone; it still paints its fade from the stack's
       right edge, where the word used to sit. */
    position: absolute;
    right: 0;
    opacity: 0;
    transform: translateX(0.3rem) scaleX(0.6);
    letter-spacing: -0.06em;
  }

  .site-header.nav-centered .nav-toggle-glyph {
    opacity: 1;
    transform: rotate(90deg) scale(1);
    transition-delay: 0.06s, 0.06s, 0s;
  }

  .nav-toggle[aria-expanded="true"] .nav-toggle-glyph {
    font-weight: 700;
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
       drop gives the stack a clear air margin under the
       bar — the panel is a floating sheet, not the bar's
       own dropdown (Mark's call, 2026-10-30): the extra
       .65 covers the stretch from the centred wrapper's
       bottom edge down to the bar's bottom, which the
       wrapper does not span, and each pill carries a drop
       shadow (below) so the stack reads as floating over
       the page. */
    top: calc(100% + 0.75rem + 0.65rem);
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
    /* Wider side margins (Mark's call, 2026-10-30): the
       panel rows join the site-wide Apple-spec pill sweep
       at 1.25rem, the Background row and the collapsed
       dots pill moving with them to hold the icon line. */
    padding: 0.55rem 1.25rem;
    border-radius: 999px;
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent), 0 12px 32px rgb(0 0 0 / 0.2);
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
     panel, laid out like the links — text left, icon rightmost.
     Its face is its own now (the Background design lives in
     LightToggle itself, one face for bar and panel alike);
     here it only gains the panel's solid surface and ring,
     and stretches to the panel's width with its label and
     icon at the ends. */
  .switch-wrap :deep(.theme-pill) {
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent), 0 12px 32px rgb(0 0 0 / 0.2);
    justify-content: space-between;
    /* Panel parity (the spacing system, 2026-10-30): the
       Background row takes the link rows' exact metrics, so
       all six panel rows share a height and a text line —
       1.25rem inline since the Apple-spec sweep. */
    padding: 0.55rem 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle,
  .nav-toggle-label,
  .nav-toggle-glyph,
  .primary-nav,
  .nav-pill {
    transition: none;
  }
}
</style>
