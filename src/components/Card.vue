<template>
  <div class="card">
    <div class="contents">
      <div class="left-container">
        <div>
          <h1 class="text-main-title">{{name}}</h1>
          <div class="medium">{{medium}}</div>
          <div class="carousel-container" v-if="windowWidth <= 980">
            <div v-if="images" class="carousel-shell" :class="{ 'navs-revealed': navsRevealed, 'navs-active': navsActive }" :style="{ '--nav-dur': navEffect === 'fade' ? '1200ms' : '450ms' }" @pointerdown.capture="onNavPress">
              <div class="carousel-bed" :style="{ backgroundColor: bedColor }" aria-hidden="true"></div>
              <Carousel class="styled-carousel" :items-to-show="1" :autoplay="autoplay" :wrap-around="true" :pause-autoplay-on-hover="true" :slide-effect="navEffect" :transition="navEffect === 'fade' ? 1200 : 450" @slide-start="onSlideStart" @slide-end="onSlideEnd">
                <Slide v-for="(image, index) in images" :key="index">
                  <img class="carousel-image" loading="lazy" v-bind:src="image"/>
                </Slide>
                <template #addons>
                  <Navigation>
                    <template #prev><span class="carousel-nav-icon" aria-hidden="true">chevron_left</span></template>
                    <template #next><span class="carousel-nav-icon" aria-hidden="true">chevron_right</span></template>
                  </Navigation>
                  <Pagination />
                </template>
              </Carousel>
            </div>
          </div>
          <p class="text-paragraph text-subtitle">{{summary}}</p>
          <p class="text-paragraph" v-for="(text, index) in copy" :key="index">{{text}}</p>
        </div>
        <div class="button-container" :class="{ empty: !copy }">
          <StyledButton
            v-if="links.primary"
            primary
            :color="links.color"
            v-bind:href="links.primary.url"
            target="_blank"
          ><span class="text-button-text">{{links.primary.name}}</span><i class="fas fa-arrow-right"></i></StyledButton>
          <StyledButton
            v-if="links.secondary"
            secondary
            :color="links.color"
            v-bind:href="links.secondary.url"
            target="_blank"
          ><span class="text-button-text">{{links.secondary.name}}</span><i class="fas fa-arrow-right"></i></StyledButton>
        </div>
      </div>
      <div class="carousel-container" v-if="windowWidth > 980">
        <div v-if="images" class="carousel-shell" :class="{ 'navs-revealed': navsRevealed, 'navs-active': navsActive }" :style="{ '--nav-dur': navEffect === 'fade' ? '1200ms' : '450ms' }" @pointerdown.capture="onNavPress">
          <div class="carousel-bed" :style="{ backgroundColor: bedColor }" aria-hidden="true"></div>
          <Carousel class="styled-carousel" :items-to-show="1" :autoplay="autoplay" :wrap-around="true" :pause-autoplay-on-hover="true" :slide-effect="navEffect" :transition="navEffect === 'fade' ? 1200 : 450" @slide-start="onSlideStart" @slide-end="onSlideEnd">
            <Slide v-for="(image, index) in images" :key="index">
              <img class="carousel-image" loading="lazy" v-bind:src="image"/>
            </Slide>
            <template #addons>
              <Navigation>
                <template #prev><span class="carousel-nav-icon" aria-hidden="true">chevron_left</span></template>
                <template #next><span class="carousel-nav-icon" aria-hidden="true">chevron_right</span></template>
              </Navigation>
              <Pagination />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'
import StyledButton from './StyledButton.vue'

// All vue-styled-components wrappers in this file became plain elements with
// the scoped classes below; theme interpolations became the CSS variables
// ThemeRoot sets (screen widths/paddings are theme constants — 980/600/360
// and 48/20/20 in both themes — inlined in the media queries).
export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    StyledButton
  },
  props: {
    name: String,
    medium: String,
    summary: String,
    copy: Array,
    links: {
      color: String,
      primary: {
        name: String,
        url: String
      },
      secondary: {
        name: String,
        url: String
      }
    },
    images: Array,
    // Optional per-card autoplay period. The ASI and Flux
    // carousels run asynchronously (Mark's call, 2026-10-30):
    // different periods — 6s here by default, 8s for Flux in the
    // data — so their fades never lock into step.
    autoplayMs: Number
  },
  data() {
    // Timed slides are back (Mark's call, 2026-10-30: the ASI and
    // Flux carousels used to advance on their own). Six seconds a
    // slide — 4.5 read as too fast — wrapping at the end and
    // pausing while a pointer hovers; visitors who ask for
    // reduced motion get the manual carousel back, so autoplay
    // resolves to 0 for them.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return {
        windowWidth: window.innerWidth,
        autoplay: reduceMotion ? 0 : (this.autoplayMs || 6000),
        // Autoplay crossfades; a person navigating gets a slide
        // (Mark's call, 2026-10-30). navEffect flips to 'slide'
        // on a press of the arrows or dots and back to 'fade'
        // when that move settles.
        navEffect: 'fade',
        // The colour layer under the crossfade: the average
        // colour of the slide that was showing before the
        // current one (Mark's call, 2026-10-30), computed from
        // the images themselves below. The dark value is the
        // fallback until they are measured, or if one cannot be.
        bedColor: '#101216',
        avgColors: [],
        currentSlide: 0,
        // The chevron navs' presence (Mark's call, 2026-10-30):
        // absent on load, revealed by the first transition,
        // swelling while a transition runs and settling back to
        // a sheerer rest — see the nav rules below.
        navsRevealed: false,
        navsActive: false
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    onNavPress(e) {
      if (e.target.closest('.carousel__prev, .carousel__next, .carousel__pagination-button')) {
        this.navEffect = 'slide'
      }
    },
    onSlideStart() {
      this.navsRevealed = true
      this.navsActive = true
    },
    onSlideEnd(payload) {
      this.navsActive = false
      const len = (this.images || []).length
      if (len) {
        const raw = payload && (payload.currentSlideIndex ?? payload.currentSlide ?? 0)
        const idx = ((raw % len) + len) % len
        this.currentSlide = idx
        if (this.avgColors[idx]) {
          this.bedColor = this.avgColors[idx]
        }
      }
      if (this.navEffect === 'slide') {
        setTimeout(() => { this.navEffect = 'fade' }, 60)
      }
    },
    measureBedColors() {
      ;(this.images || []).forEach((src, i) => {
        const img = new Image()
        img.onload = () => {
          try {
            const s = 12
            const c = document.createElement('canvas')
            c.width = s
            c.height = s
            const ctx = c.getContext('2d')
            ctx.drawImage(img, 0, 0, s, s)
            const d = ctx.getImageData(0, 0, s, s).data
            let r = 0, g = 0, b = 0, n = 0
            for (let p = 0; p < d.length; p += 4) {
              r += d[p]
              g += d[p + 1]
              b += d[p + 2]
              n++
            }
            const col = `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`
            this.avgColors[i] = col
            if (i === this.currentSlide) {
              this.bedColor = col
            }
          } catch (err) {
            // A colour that cannot be measured keeps the fallback.
          }
        }
        img.src = src
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.measureBedColors()
  },
  // Vue 3 rename of beforeDestroy; also now actually removes the listener
  // (the original passed a fresh anonymous function, so removal was a no-op).
  beforeUnmount() {
      window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style scoped>
.card {
  /* Fluid under the authored sizes (2026-10-30): the old fixed
     steps (980/600/360) stranded wide phones on the 360 step while
     the rest of the page went fluid. One cap per range now, and
     the card takes whatever the viewport actually offers. */
  width: 100%;
  max-width: 980px;
  background: var(--card-background);
  box-shadow: var(--card-box-shadow);
  border-radius: var(--radius-card);
  margin: auto;
  margin-bottom: 80px;
  /* Can't transition radial gradients */
  /* transition: 0.3s background; */
}
@media screen and (max-width: 980px) {
  .card {
    max-width: 600px;
    /* The stack's one rate (the spacing system, 2026-10-30).
       The identical 600px restatement that used to sit below
       this block is gone — this rule already covers it. */
    margin-bottom: var(--stack-gap);
  }
}
/* Disabled for performance issues */
/* backdrop-filter: blur(10px); */

.contents {
  display: flex;
  padding: 64px 48px;
}
@media screen and (max-width: 980px) {
  .contents {
    /* On the card family's text line (the spacing system,
       2026-10-30): the side inset is the gutter, so major-card
       text starts where minor-card text starts. Was the px
       island 40px 20px. The identical 600px restatement that
       used to sit below this block is gone. */
    padding: 2.5rem var(--gutter);
    /* Border-box at the card's full width: content lands at the
       card's width less the padding, the old 560 content-box step
       plus its padding having been the same total by accident. */
    box-sizing: border-box;
    width: 100%;
    margin: 0;
  }
}

.left-container {
  width: 320px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
@media screen and (max-width: 980px) {
  .left-container {
    width: 100%;
    max-width: 560px;
    /* The carousel lives inside this container at these widths
       (see the template's windowWidth switch), so the desktop
       margin-right — room for a carousel beside it that is not
       there — goes, or the row overflows its own card. */
    margin-right: 0;
  }
}
.medium {
  font-weight: 300;
  font-size: 0.75rem;
  letter-spacing: 1.8px;
  margin-bottom: 1.5em;
}

/* Order preserved from the styled-components template (media query first,
   then the prop-driven margin) so the cascade resolves the same way. */
@media screen and (max-width: 980px) {
  .button-container {
    margin-top: 32px;
  }
}
.button-container {
  margin-top: 0px;
}
/* The button's own 20px right margin is zeroed inside card
   rows too (the spacing system, 2026-10-30) — the hero and
   Contact already did this; the card row was the holdout. */
.button-container :deep(.styled-button) {
  margin-right: 0;
}
.button-container.empty {
  margin-top: 32px;
}

.carousel-image {
  width: 100%;
  float: right;
  object-fit: cover;
  object-position: top;
  opacity: var(--card-carousel-opacity);
}
.carousel-image:hover {
  cursor: grab;
}
.carousel-image:active {
  cursor: grabbing;
}

.carousel-container {
  margin: auto;
}

/* vue3-carousel replacement for the styled(vue-carousel) block below it in
   the original file: root keeps the same size/shadow/radius; the
   .VueCarousel-* selectors map to vue3-carousel's .carousel__* classes. */
.styled-carousel {
  box-shadow: var(--card-carousel-box-shadow);
  border-radius: 10px;
  overflow: hidden;
  height: 275px;
  width: 500px;
  /* The slide indicators, through the library's own variables:
     round dots in the site's neutral grey, the active one solid,
     lifted off the carousel's bottom edge. */
  --vc-pgn-width: 0.5rem;
  --vc-pgn-height: 0.5rem;
  --vc-pgn-border-radius: 50%;
  --vc-pgn-gap: 0.45rem;
  --vc-pgn-background-color: rgb(127 127 127 / 35%);
  /* The active dot is the same grey as the rest (2026-10-30):
     its weight marks it, not its colour — see the scale rule
     below the shell styles. */
  --vc-pgn-active-color: rgb(127 127 127 / 35%);
  --vc-png-bottom: 0.6rem;
  /* The overlaid prev/next controls, kept subtle (Mark's call,
     2026-10-30): small dark circles, white chevrons. Their
     presence follows the carousel's motion — the opacity rules
     below the shell styles carry that. */
  --vc-nav-width: 2rem;
  --vc-nav-height: 2rem;
  --vc-nav-border-radius: 50%;
  --vc-nav-background: rgb(0 0 0 / 0.28);
  --vc-nav-color: #fff;
  /* The chevron's colour does not change on hover (Mark's
     call, 2026-10-30): the library recolours the nav buttons
     on hover from this variable, whose default is its own
     dark tone — set it to the resting colour, so on hover
     only the glyph's variable weight moves. */
  --vc-nav-color-hover: #fff;
}
.styled-carousel :deep(.carousel__prev) {
  inset-inline-start: 0.5rem;
}
.styled-carousel :deep(.carousel__next) {
  inset-inline-end: 0.5rem;
}
/* Nav presence follows the carousel's own motion (Mark's
   call, 2026-10-30): no chevrons on load — the buttons sit at
   opacity 0 until the first transition reveals them. While a
   transition runs they swell to near-full; when it settles
   they rest at a sheerer third. The opacity animation lasts
   exactly the transition's own duration (--nav-dur rides the
   shell from the same fade/slide values the carousel gets),
   so the chevrons breathe in sync with the slides. */
.styled-carousel :deep(.carousel__prev),
.styled-carousel :deep(.carousel__next) {
  opacity: 0;
  transition: opacity var(--nav-dur, 1200ms) ease;
}
.carousel-shell.navs-revealed .styled-carousel :deep(.carousel__prev),
.carousel-shell.navs-revealed .styled-carousel :deep(.carousel__next) {
  opacity: 0.35;
}
.carousel-shell.navs-active .styled-carousel :deep(.carousel__prev),
.carousel-shell.navs-active .styled-carousel :deep(.carousel__next) {
  opacity: 0.9;
}
/* Emphasis is the icon's variable weight, not colour (Mark's
   call, 2026-10-30): the chevrons are Material Symbols, and
   hovering or pressing a nav button takes its glyph from
   wght 400 to 700 while the circle and its colour stay put.
   Keyboard focus still surfaces the whole button. */
.styled-carousel :deep(.carousel__prev:focus-visible),
.styled-carousel :deep(.carousel__next:focus-visible) {
  opacity: 1;
}
.carousel-nav-icon {
  font-family: 'Material Symbols Rounded';
  font-size: 1.3rem;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  transition: font-variation-settings 0.25s ease;
}
.styled-carousel :deep(.carousel__prev:hover) .carousel-nav-icon,
.styled-carousel :deep(.carousel__next:hover) .carousel-nav-icon,
.styled-carousel :deep(.carousel__prev:active) .carousel-nav-icon,
.styled-carousel :deep(.carousel__next:active) .carousel-nav-icon {
  font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24;
}
.styled-carousel :deep(.carousel__viewport),
.styled-carousel :deep(.carousel__track),
.styled-carousel :deep(.carousel__slide) {
  height: 100%;
  /* No hand over the carousel (Mark's call, 2026-10-30): the
     picture area keeps the plain cursor; only the actual
     controls carry a pointer. */
  cursor: default;
}
/* The shell hugs the carousel's own box so the layer under it
   lines up exactly; the bed is the crossfade's colour layer,
   holding the previous slide's average colour (script above),
   so a fade passes through the outgoing picture's own colour
   instead of a dip to black or a flash of page. */
.carousel-shell {
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
}
.carousel-bed {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: #101216;
}
.styled-carousel :deep(.carousel__pagination-button) {
  transition: transform 0.25s ease;
}
/* The active indicator's weight (Mark's call, 2026-10-30):
   every dot the same grey; the current one is heavier. */
.styled-carousel :deep(.carousel__pagination-button--active) {
  transform: scale(1.4);
}
/* No pagination overrides here on purpose: the old block forced
   left: 0 / right: 0 / bottom: 0 onto the library's pagination,
   which centres itself with left: 50% and translateX(-50%) — a
   transform this block never reset, so the indicator row sat
   shifted half its own width off centre, flush against the
   bottom edge. Its ::after rules were also leftovers from the
   previous carousel library, painting over this one's buttons.
   The library's own positioning plus the variables above are
   the whole design now. */
@media screen and (max-width: 980px) {
  .styled-carousel {
    width: 100%;
    max-width: 560px;
    /* Height follows width at the authored ratio instead of a
       second fixed step. */
    aspect-ratio: 560 / 308;
    height: auto;
    margin: 0;
  }
  /* The unit's outer margin lives on the shell, so the colour
     bed inside it stays flush with the carousel's box. */
  .carousel-shell {
    margin: 20px 0;
  }
}
@media screen and (max-width: 600px) {
  .styled-carousel {
    width: 100%;
    height: auto;
  }
}
</style>
