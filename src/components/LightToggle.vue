<template>
  <button
    type="button"
    class="light-toggle"
    role="switch"
    :aria-checked="isDark ? 'true' : 'false'"
    aria-label="Toggle light and dark mode"
    @click="toggleTheme"
  >
    <span class="switch-track" aria-hidden="true">
      <span class="switch-knob"><i :class="isDark ? 'fas fa-moon' : 'fas fa-sun'"></i></span>
    </span>
    <slot />
  </button>
</template>

<script>
import { localStore, toggleTheme } from '../theme.js'

// The light/dark control as a real switch (Mark, 2026-10-29: "a
// thoughtful toggle"): role="switch" with aria-checked, a track and
// a sliding knob that carries the current mode's icon — sun in light
// mode, moon in dark. Replaces the bare bulb button, whose floated
// position styles from the vue-styled-components era are gone.
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
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: none;
  background: transparent;
  padding: 0.25rem;
  font: inherit;
  color: var(--main-color);
  cursor: pointer;
}

.switch-track {
  position: relative;
  flex: none;
  width: 3.25rem;
  height: 1.75rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--main-color) 16%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 24%, transparent);
  transition: background-color 0.25s ease;
}

.switch-knob {
  position: absolute;
  top: 50%;
  left: 0.1875rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  background: var(--main-background-color);
  color: var(--main-color);
  font-size: 0.7rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
  transition: left 0.25s ease;
}

.light-toggle[aria-checked="true"] .switch-knob {
  left: calc(100% - 1.375rem - 0.1875rem);
}

@media (prefers-reduced-motion: reduce) {
  .switch-track,
  .switch-knob {
    transition: none;
  }
}
</style>
