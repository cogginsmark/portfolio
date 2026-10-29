<template>
  <div id="app">
    <LiquidGlassFilter />
    <a class="skip-link" href="#main">Skip to content</a>
    <SiteHeader />
    <main id="main">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import SiteHeader from './components/SiteHeader.vue'
import LiquidGlassFilter from './components/LiquidGlassFilter.vue'

// The app shell: skip link, the shared SiteHeader, and the routed page
// inside a <main> landmark with a short fade/slide between routes.
export default {
  name: 'App',
  components: {
    SiteHeader,
    LiquidGlassFilter
  },
  mounted() {
    // Liquid Glass refraction is a Chromium-only backdrop capability
    // (the library's own canRefractBackdrop test); only there do the
    // glass surfaces gain the SVG filter. Everywhere else they keep
    // the frosted blur the stylesheet gives them.
    const ua = navigator.userAgent
    if (/Chrom(e|ium)\/|Edg\//.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)) {
      document.documentElement.style.setProperty('--lg-filter', 'url(#liquid-glass-refract-3)')
    }
  }
}
</script>

<style scoped>
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
  .skip-link {
    transition: none;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
</style>
