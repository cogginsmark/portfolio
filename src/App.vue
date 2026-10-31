<template>
  <div id="app">
    <div class="page-background" aria-hidden="true"></div>
    <div class="watercolor-layer" :class="{ 'is-away': $route.path !== '/' }" aria-hidden="true"></div>
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <router-view v-slot="{ Component }">
        <Transition :name="transitionName" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import SiteHeader from './components/SiteHeader.vue'

// The app shell: skip link, the shared SiteHeader, and the routed page
// inside a <main> landmark with a short fade/slide between routes.
export default {
  name: 'App',
  components: {
    SiteHeader
  },
  computed: {
    // Contact does not fade in (Mark's call, 2026-10-30): its
    // navigation swaps instantly and the page's own delayed
    // title does the arriving. Every other route keeps the
    // fade/slide.
    transitionName() {
      return this.$route.path === '/contact' ? 'page-none' : 'page'
    }
  }
}
</script>

<style scoped>
/* The theme gradient lives on this fixed, viewport-sized layer
   instead of on <html> (Mark's background-shift bug, 2026-10-30):
   a gradient's geometry derives from the box it is painted on,
   and html's box is the whole document, so the wash stretched on
   long pages (Home) and compressed on short ones (About) and
   visibly jumped between them. Locked to the viewport, the
   gradient is the same size, angle and stop positions on every
   page. It sits behind everything (negative z-index over the
   flat fallback colour html now carries) and never takes
   pointer events. background-attachment: fixed on html would
   say the same thing in one line, but iOS Safari handles fixed
   root backgrounds badly, so the layer does it instead. */
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* Sized once to the LARGE viewport instead of inset: 0
     (2026-10-30, Mark's report): tied to the visual viewport, the
     layer resized and repainted as iOS Safari's bars came and
     went, so the gradient chased the scroll — and the strip
     behind Safari's bar fell outside the layer entirely. 100lvh
     is the stable maximum viewport, bars hidden, so the layer
     keeps one size while scrolling and the gradient runs behind
     the bars. The 100vh line is the fallback for older engines. */
  height: 100vh;
  height: 100lvh;
  z-index: -1;
  background: var(--main-background-color);
  pointer-events: none;
}

/* On phones the layer swaps the live gradient for the
   offline-rendered picture of it (Mark's call, 2026-10-30):
   the CSS gradient never did manage the Safari bar, so the
   background is a rendered image here, sized to cover, with
   theme.js keeping the bar's own theme-color matched to the
   gradient's end. */
@media screen and (max-width: 40rem) {
  .page-background {
    background-image: url("/bg-gradient-light.png");
    background-size: cover;
    background-position: center;
  }

  :root[data-theme="dark"] .page-background {
    background-image: url("/bg-gradient-dark.png");
  }
}

/* The watercolor is present on all pages (Mark's call,
   2026-10-30, as corrected by him the same day): this fixed
   layer paints the same cover the hero uses, over the gradient
   and behind the content, at full strength on Home — and when
   navigation leaves Home it fades to 30%, the opacity
   transition doing the fading as the route changes. The light
   theme's inverted painting is set in global.css, beside the
   hero's own. */
.watercolor-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100lvh;
  z-index: -1;
  background-image: var(--hero-background-image);
  background-size: cover;
  background-position: 50%;
  opacity: 1;
  transition: opacity 0.45s ease;
  pointer-events: none;
}

.watercolor-layer.is-away {
  opacity: 0.3;
}

/* Sticky-footer shell: the column always fills the viewport, <main>
   takes whatever height is left, and each routed page stretches to
   fill it — so on short pages the footer ends at the bottom of the
   screen instead of sticking out mid-page where the content ended. */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

#main {
  display: flex;
  flex-direction: column;
  flex: 1;
}

#main > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.skip-link {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 1100;
  padding: 0.55rem 1rem;
  border-radius: 0 0 10px 10px;
  background: var(--main-color);
  color: var(--main-background-color);
  transition: top 0.2s ease;
}

.skip-link:focus-visible {
  top: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-none-enter-active,
.page-none-leave-active {
  transition: none;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active,
  .skip-link,
  .watercolor-layer {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
