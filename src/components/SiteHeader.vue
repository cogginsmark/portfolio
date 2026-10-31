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

      <nav id="primary-nav" class="primary-nav" aria-label="Primary" @click="markNavTapped" @animationend="onNavPillSettled">
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
    routeReady: false
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
    onNavPillSettled(event) {
      // The arrival has finished: hand its end state (the
      // reduced standing pill) to a real class with the
      // same values and stand the animation down. While the animation's fill was the last word,
      // it outranked every hover style and the pill snapped
      // instead of transitioning (Mark's bug report,
      // 2026-10-30); as plain styles, the settled values
      // transition smoothly in and out of hover from here.
      if (!event.animationName || !event.animationName.startsWith('nav-pill-fade')) return
      const link = event.target
      if (link.classList && link.classList.contains('router-link-exact-active')) {
        link.classList.add('pill-settled')
      }
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
      // Any route change after the initial resolution is
      // navigation (a back swipe included): the pill state
      // holds from here on. The first firing is the router
      // settling onto the loaded page, not a navigation.
      if (this.routeReady) {
        navStore.navigated = true
        // A fresh arrival gets a fresh fade: clear any settled
        // state so the incoming page's pill can play its
        // animation again.
        this.$el.querySelectorAll('.pill-settled').forEach((el) => el.classList.remove('pill-settled'))
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
   width, and the current page's link holds the full hitbox at
   rest too — but only once navigation has happened (Mark's
   model, 2026-10-30): on load the current item stands as bold
   text alone, and its button appears during the first
   navigation and stays for the session; a reload resets it
   to the bold standing position. Hover grows it as well, but
   only where hover exists: those rules live in the
   (hover: hover) block below, because on touch a tap was
   flashing the hover pill for a frame before the route changed
   (Mark's report, 2026-10-30). */
.nav-link:focus-visible {
  padding-inline: 0.9rem;
}

.site-header.has-navigated .nav-link.router-link-exact-active {
  padding-inline: 0.9rem;
}

@media (hover: hover) {
  .nav-link:hover {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
    padding-inline: 0.9rem;
    transition: background-color 0.18s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
  }

  /* While the current item is hovered or keyboard-focused,
     its arrival fade (below) stands down — the pill is being
     interacted with, so it stays. Leaving lets the finished
     fade's end state resume. */
  .site-header.has-navigated .nav-link.router-link-exact-active:hover,
  .site-header.has-navigated .nav-link.router-link-exact-active:focus-visible {
    animation: none;
  }

  /* Hovering the header brings the current item's pill back
     to full strength (Mark's call, 2026-10-30, widened from
     the nav area to the whole bar the same day) — it stands
     at its reduced opacity otherwise, and returns to full
     while the pointer is anywhere over the header. The element in the chain keeps it
     above the settled rule; the settled item's own hover
     rule below still wins on the item itself, with the
     stronger fill. */
  header.site-header.has-navigated:hover .nav-link.router-link-exact-active {
    animation: none;
    background: color-mix(in srgb, var(--main-color) 6%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
    padding-inline: 0.9rem;
  }

  .site-header.has-navigated .nav-link.router-link-exact-active.pill-settled:hover {
    background: color-mix(in srgb, var(--main-color) 16%, transparent);
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

/* The current page is always carried by the bold text — that
   is its standing position, on load and after. The pill
   itself (the faded fill and ring) joins only once the
   header has navigated, per the model above. */
.nav-link.router-link-exact-active {
  color: var(--main-color);
  font-weight: 700;
  transition: background-color 0.25s ease, box-shadow 0.25s ease, color 0.2s ease, padding 0.25s ease, font-weight 0.25s ease;
}

.site-header.has-navigated .nav-link.router-link-exact-active {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  /* The pill arrives at full strength, then settles to a
     quieter standing state (Mark's call, 2026-10-30): the
     current item keeps its pill, at a reduced background
     opacity, instead of giving it up and standing as bold
     text alone. */
  animation: nav-pill-fade 1.6s ease forwards;
  /* The hitbox is at its end state from the first frame
     (Mark's call, 2026-10-30): padding does not transition
     while the item stands in its navigated state — the
     background, colour and weight keep their rates. */
  transition-property: background-color, color, padding, font-weight;
  transition-duration: 0.45s, 0.2s, 0s, 0.25s;
}

@keyframes nav-pill-fade {
  /* The pill's background arrives the way the Menu toggle's
     does (Mark's call, 2026-10-30) — the fill and ring fade
     in, hold a beat at full strength, then dim to the
     reduced standing pill. The hitbox does not take part
     (Mark's call, 2026-10-30): the gated rule below holds
     the padding at its end state from the first frame, so
     the item's target is full-size throughout the arrival
     and only the background animates. */
  0% {
    background-color: transparent;
    box-shadow: inset 0 0 0 1px transparent;
  }
  22%, 58% {
    background-color: color-mix(in srgb, var(--main-color) 6%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  }
  100% {
    background-color: color-mix(in srgb, var(--main-color) 3%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 6%, transparent);
  }
}

/* The settled state (see onNavPillSettled): the arrival's
   end values — the reduced standing pill — as plain styles,
   animation stood down, so hover and focus transitions run
   smoothly from here. */
.site-header.has-navigated .nav-link.router-link-exact-active.pill-settled {
  animation: none;
  background: color-mix(in srgb, var(--main-color) 3%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 6%, transparent);
  padding-inline: 0.9rem;
}

.site-header.has-navigated .nav-link.router-link-exact-active.pill-settled:focus-visible {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
  padding-inline: 0.9rem;
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
    /* Text-defined at rest (Mark's call, 2026-10-30: reactive
       again): the items hug their words, and state changes —
       becoming current, focus — grow the pill through the
       links' own padding and weight transitions. The two-state
       promotion tried earlier today is gone. */
    padding: 0.4rem 0.3rem;
    font-size: 0.88rem;
  }

  .nav-link:focus-visible {
    padding-inline: 0.5rem;
  }

  /* The current item: full hitbox once the header has
     navigated, reached reactively — the base transition
     animates the padding and the variable weight together
     as the item becomes current, the same glide the desktop
     bar has always had. Before any navigation the item
     stands as bold text at its text spacing. */
  .site-header.has-navigated .nav-link.router-link-exact-active {
    padding-inline: 0.5rem;
    animation: nav-pill-fade-mobile 1.6s ease forwards;
    transition-property: background-color, color, padding, font-weight;
    transition-duration: 0.45s, 0.2s, 0s, 0.25s;
  }

  @keyframes nav-pill-fade-mobile {
    /* Background only, as on desktop: the hitbox sits at
       its end state (.5rem, the gated rule) throughout. */
    0% {
      background-color: transparent;
      box-shadow: inset 0 0 0 1px transparent;
    }
    22%, 58% {
      background-color: color-mix(in srgb, var(--main-color) 6%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
    }
    100% {
      background-color: color-mix(in srgb, var(--main-color) 3%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 6%, transparent);
    }
  }

  .site-header.has-navigated .nav-link.router-link-exact-active.pill-settled {
    padding-inline: 0.5rem;
  }

  .site-header.has-navigated .nav-link.router-link-exact-active.pill-settled:focus-visible {
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
    right: var(--gutter);
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
       panel rows' own 1rem inset, so the dots sit on the
       same right-hand line as the rows' icons below (Mark's
       call, 2026-10-30); the background already matched the
       rows and is untouched. The right edge does not move:
       the wrap is anchored to the gutter line, and the
       panel below keys off the same edge. */
    padding: 0.4rem 1rem;
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
     panel, laid out like the links — text left, icon rightmost.
     Its face is its own now (the Background design lives in
     LightToggle itself, one face for bar and panel alike);
     here it only gains the panel's solid surface and ring,
     and stretches to the panel's width with its label and
     icon at the ends. */
  .switch-wrap :deep(.theme-pill) {
    background: var(--fallback-background-color);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 10%, transparent);
    justify-content: space-between;
    /* Panel parity (the spacing system, 2026-10-30): the
       Background row takes the link rows' exact metrics, so
       all six panel rows share a height and a text line. */
    padding: 0.55rem 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .nav-link,
  .nav-toggle,
  .nav-toggle-label,
  .nav-toggle-glyph,
  .primary-nav {
    transition: none;
  }

  /* No arrival fade under reduced motion: the navigated
     pill simply stays, as it did before the fade. */
  .site-header.has-navigated .nav-link.router-link-exact-active {
    animation: none;
  }
}
</style>
