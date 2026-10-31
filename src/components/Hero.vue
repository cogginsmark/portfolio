<template>
  <div class="hero-background" :class="{ 'bg-ready': bgReady }">
    <div class="hero-container">
      <div class="hero-text-container">
        <h1 class="hero-heading">{{author}}</h1>
        <p class="text-paragraph text-subtitle">{{subtitle}}</p>
        <p class="text-paragraph" style="white-space: pre-wrap;">{{description}}</p>
        <div class="cta-section">
          <StyledButton glass secondary :color="'#363636'" v-bind:href="ctaUrl || '/resume.pdf'"><span class="text-button-text">{{cta}}</span><i class="fas fa-arrow-down"></i></StyledButton>
          <StyledButton glass v-if="cta2" secondary :color="'#363636'" v-bind:href="cta2Url" target="_blank" rel="noopener"><span class="text-button-text">{{cta2}}</span><span class="journalism-icon" aria-hidden="true">history_edu</span></StyledButton>
          <router-link v-if="cta3" :to="cta3Url" class="cta-nav-link"><StyledButton glass secondary :color="'#363636'"><span class="text-button-text">{{cta3}}</span><i class="fas fa-play"></i></StyledButton></router-link>
        </div>
      </div>
      <section class="services-section services-section--hero" aria-label="Services">
        <p class="services-line">Design · Video editing · Motion graphics · Social</p>
      </section>
    </div>
  </div>

</template>

<script>
import StyledButton from './StyledButton.vue'

// StyledButton was previously re-exported from Card.vue (both were
// vue-styled-components); it is now its own component.
export default {
  components: {
    StyledButton
  },
  data() {
    return {
      bgReady: false
    }
  },
  mounted() {
    // The cover fades in when the image itself is ready
    // (Mark's bug report, 2026-10-30): navigating Home mounts
    // this component before the photograph has downloaded, and
    // as the element's own background it simply appeared the
    // moment the file landed. Preload it, then let the CSS
    // transition on the ::before layer do the fade. The light
    // theme paints the same photograph inverted from its own
    // hardcoded layer, so that file is the one to wait for
    // there.
    const isLight = document.documentElement.dataset.theme === 'light'
    let src = '/falcon-dark-minus-50-brightness2.webp'
    if (!isLight) {
      const varValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--hero-background-image')
      const match = varValue.match(/url\(["']?(.*?)["']?\)/)
      if (match) {
        src = match[1]
      }
    }
    const img = new Image()
    img.onload = () => {
      this.bgReady = true
    }
    img.onerror = () => {
      this.bgReady = true
    }
    img.src = src
  },
  props: {
    author: String,
    cta: String,
    cta2: String,
    cta3: String,
    ctaUrl: String,
    cta2Url: String,
    cta3Url: String,
    subtitle: String,
    description: String
  }
}
</script>

<style scoped>
.hero-background {
  position: relative;
  height: 800px;
  width: 100%;
  /* No fixed floor under the width (2026-10-30): this used to
     carry min-width: 360px, the last hard minimum on the home
     page — any viewport narrower than that (small phones, split
     view, an app webview) got a hero wider than its screen and
     a page that outgrew its own width. The hero is the width it
     is given, full stop. */
  margin: auto;

  /* Responsive */
  height: 100vh;
  min-height: 600px;
  max-height: 1035px;
}

/* The cover lives on this layer and fades in once the image
   has loaded (the script sets .bg-ready from the preload):
   as the element's own background it appeared the instant the
   download finished, mid-navigation, with no fade at all
   (Mark's bug report, 2026-10-30). The light theme's inverted
   cover in global.css is this same pseudo-element — it
   supplies its own image and filter there and inherits this
   fade. */
.hero-background::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--hero-background-image);
  background-size: cover;
  background-position: 50%;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.hero-background.bg-ready::before {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .hero-background::before {
    transition: none;
  }
}

@media screen and (max-width: 980px) {
  .hero-background::before {
    background-position: 60% -45px;
    /* Cover, explicitly (2026-10-30 fix): this rule used to say
       "inherit", which once picked up the element's own cover
       sizing — but the image lives on this pseudo-element now
       and the element itself carries no background-size, so
       inherit resolved to auto and phones painted the wash at
       its natural 1920px size, a wrong zoomed slice. */
    background-size: cover;
  }
}

.hero-container {
  position: relative;
  z-index: 1;
  max-width: 980px;
  margin: auto;
  /* padding-top: 180px; */

  /* Responsive */
  height: 100vh;
  min-height: 600px;
  max-height: 1035px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-text-container {
  /* Fluid under its authored size (2026-10-30): the column is
     390px where there is room and shrinks with the viewport
     instead of holding a fixed width to the smallest screens. */
  width: min(390px, calc(100% - var(--gutter) * 2));
  margin: 10px;

  /* Responsive */
  margin-top: -20px;
}
@media screen and (max-width: 980px) {
  .hero-text-container {
    /* No 320px step (2026-10-30 fix): on wide phones that cap was
       narrower than the CTA pair, so the buttons could only stack
       one per row. The column keeps its desktop measure and simply
       goes fluid under it. */
    width: min(390px, calc(100% - var(--gutter) * 2));
    margin: auto;
  }
}

.hero-heading {
  font-size: 3rem;
  margin: 0.67em auto;
  font-weight: bold;
  line-height: var(--leading-display);
  letter-spacing: -0.015em;
}
@media screen and (max-width: 61.25rem) {
  .hero-heading {
    font-size: 2.625rem;
  }
}

/* The services line's desktop placement (Mark's call,
   2026-10-30): centred between the CTAs and the first card.
   On desktop the hero is a full-height stage with its text
   group centred, so the span from the group's foot to the
   card's top edge (which overlaps the hero's foot by
   5.25rem) has its midpoint at three-quarters of the hero
   plus a quarter of the group's height, less half the
   overlap — the section is anchored there, out of flow, so
   the group itself never moves. Below the desktop widths
   this instance stands down: the line's home there is the
   card column's first row (Home.vue), in the joint itself. */
.services-section--hero {
  display: none;
}

@media (min-width: 61.25rem) {
  .services-section--hero {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 75%;
    transform: translateY(1.85rem);
    text-align: center;
  }
}

.services-line {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  /* Wide tracking on desktop (Mark's calls, 2026-10-30 —
     widened twice): the stage has the room for it. The
     smaller widths keep the .12em of the column's row in
     Home.vue. */
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.75;
}

.cta-section {
  margin: 2.25rem 0;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 1rem;
  /* The buttons keep their defined widths (Mark's call,
     2026-10-30): each button is the width its own type and
     padding define — the row sizes to that content and never
     stretches a button wider. The row may outgrow the 390px
     text column it starts in, capped only by the viewport
     itself; where the viewport cannot hold the defined
     widths, the buttons compress (flex-shrink below) rather
     than wrapping or stacking. */
  width: max-content;
  max-width: calc(100vw - var(--gutter) * 2);
}

.cta-section :deep(.styled-button) {
  margin-right: 0;
  /* Defined width, compressible: no growth past the button's
     own measure, shrink allowed when the row is capped. */
  flex: 0 1 auto;
  min-width: 0;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cta-section :deep(.text-button-text) {
  min-width: 0;
}

/* Videos travels by the router, not a hard link (Mark's call,
   2026-10-30): its wrapper is laid out exactly like the
   buttons it sits between — defined width, compressible —
   and the button inside fills it, so the trio's geometry is
   unchanged by the swap. */
.cta-nav-link {
  flex: 0 1 auto;
  display: flex;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.cta-nav-link :deep(.styled-button) {
  flex: 1 1 auto;
}

@media screen and (max-width: 40rem) {
  /* The trio's smaller phone size now lives in StyledButton
     itself, applied to every button the site makes (2026-10-30);
     what remains here is the Journalism icon, which is sized in
     rem of its own and steps down with them. */
  .cta-section .journalism-icon {
    font-size: 1.02rem;
  }
}


/* On mobile the hero stops being a full-viewport stage: it was
   centring its text inside a 100vh box that starts below the header,
   which dropped the name far down the screen over an empty wash
   (Mark's screenshot, 2026-10-29). Now the hero hugs its content —
   text starts up under the header, and the bottom padding leaves
   exactly the room the raised cards overlap into. */
@media screen and (max-width: 61.25rem) {
  .hero-background {
    height: auto;
    min-height: 0;
    max-height: none;
  }

  .hero-container {
    height: auto;
    min-height: 0;
    max-height: none;
    justify-content: flex-start;
    padding: 3.5rem 0 6.5rem;
  }

  .hero-text-container {
    margin-top: 0;
  }
}

@media screen and (max-width: 40rem) {
  /* Phone margins (Mark's calls, 2026-10-30): the column
     runs wider — half the gutter at each side instead of
     the full page line — and the vertical padding, after a
     tighter pass, gets a step back up at both ends, still
     inside the tablet range's 3.5/6.5. The bottom keeps
     the larger share: the card stack overlaps into it. */
  .hero-container {
    padding: 3rem 0 5rem;
  }

  .hero-text-container {
    width: min(390px, calc(100% - var(--gutter)));
  }

  /* The hero's own step on phones, gentled to pair with
     the 16px phone root (Mark's pick, 2026-10-30 — "Root +
     gentler hero step"): the root already brings the
     subtitle and description to the standard 16px body
     measure, so they need no cut of their own here; the
     name alone takes a step, 2.25rem, which at the phone
     root lands on the same 36px it held under the hero-only
     reduction — the general scale goes down around it
     without the hero shrinking twice. */
  .hero-heading {
    font-size: 2.25rem;
  }

  /* The CTA row tightens its gap so the trio's defined
     widths fit more viewports before compression has to
     start. The trio's own inset rises with the site-wide
     pill sweep but stays a step under the buttons' phone
     measure — three defined widths share one row here,
     and their fit is the tighter budget. */
  .cta-section {
    gap: 0.5rem;
  }

  .cta-section :deep(.styled-button) {
    padding-inline: 0.9rem;
  }
}
</style>
