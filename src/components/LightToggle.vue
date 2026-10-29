<template>
  <button
    type="button"
    class="light-toggle lg-switch"
    role="switch"
    :aria-checked="isDark ? 'true' : 'false'"
    aria-label="Toggle light and dark mode"
    @click="toggleTheme"
  >
    <span class="switch-core" aria-hidden="true">
      <span class="lg-switch__track"></span>
      <span class="lg-switch__fill"></span>
      <span class="lg-glass lg-switch__thumb">
        <span class="lg-switch__face"><i :class="isDark ? 'fas fa-moon' : 'fas fa-sun'"></i></span>
      </span>
    </span>
    <slot />
  </button>
</template>

<script>
import { localStore, toggleTheme } from '../theme.js'

// The light/dark control on the Liquid Glass system (branch
// feat/liquid-glass): the DOM and classes of @zakisheriff/liquid-glass's
// GlassSwitch — track, fill, and a glass thumb. The library drives
// the thumb with spring physics in React; here the two resting states
// are plain CSS transitions on the same elements. The "on" tint is
// the site's own text colour rather than the library's green, and the
// thumb's face carries the mode icon (sun in light, moon in dark).
export default {
  name: 'LightToggle',
  computed: {
    isDark() {
      return localStore.dark
    }
  },
  methods: {
    toggleTheme
  }
}
</script>

<style scoped>
.light-toggle {
  --lg-switch-on: var(--main-color);
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: auto;
  height: auto;
}

/* The library's switch is a fixed 64x28 box; the core span holds
   that geometry so the mobile label can flow beside the switch
   instead of stretching its track. */
.switch-core {
  position: relative;
  flex: none;
  width: 64px;
  height: 28px;
}

.lg-switch__fill {
  transition: opacity 0.25s ease;
}

.light-toggle[aria-checked="true"] .lg-switch__fill {
  opacity: 1;
}

.lg-switch__thumb {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0.24, 1);
}

.light-toggle[aria-checked="true"] .lg-switch__thumb {
  transform: translate(26px, -50%) scale(0.655);
}

.lg-switch__face {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--main-color);
}

@media (prefers-reduced-motion: reduce) {
  .lg-switch__fill,
  .lg-switch__thumb {
    transition: none;
  }
}
</style>
