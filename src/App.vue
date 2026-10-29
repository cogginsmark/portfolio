<template>
  <div id="app">
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

// The app shell: skip link, the shared SiteHeader, and the routed page
// inside a <main> landmark with a short fade/slide between routes.
export default {
  name: 'App',
  components: {
    SiteHeader
  }
}
</script>

<style scoped>
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
