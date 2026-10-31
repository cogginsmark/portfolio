<template>
  <button
    type="button"
    class="theme-pill"
    :aria-pressed="isDark ? 'true' : 'false'"
    aria-label="Dark mode"
    @click="toggleTheme"
  >
    <i :class="isDark ? 'fas fa-moon' : 'fas fa-sun'" aria-hidden="true"></i>
    <span class="theme-pill-word">{{ isDark ? 'Dark' : 'Light' }}</span>
    <slot />
  </button>
</template>

<script>
import { localStore, toggleTheme } from '../theme.js'

// The light/dark control as a simple pill (Mark's pick,
// 2026-10-30): the current mode's icon and word on a pill in
// the header's own button language, state carried by
// aria-pressed — no track, no sliding knob. Simpler and more
// accessible than the switch it replaces: a full-height tap
// target, a state that reads at a glance, and a pressed state
// assistive tech announces. In the Menu panel the control is
// a Background item instead (Mark's call, 2026-10-30): the
// slot carries a fixed "Background" label and the dark_mode
// symbol, and the pill's own swapping icon and word stand
// down there (SiteHeader's styles), so nothing about the
// item's face changes on toggle.
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
.theme-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--pill-icon-gap);
  min-height: 2.25rem;
  margin: 0;
  padding: 0.45rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--main-color);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s ease, box-shadow 0.25s ease;
}

/* The icon's block is reserved at its final size — the site's
   standing rule for button icons. */
.theme-pill i {
  flex: none;
  width: 1rem;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1;
}

/* Dark reads as the pressed, current pill — the header's own
   treatment for the current thing. */
.theme-pill[aria-pressed="true"] {
  background: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--main-color) 12%, transparent);
}

@media (hover: hover) {
  .theme-pill:hover {
    background: color-mix(in srgb, var(--main-color) 8%, transparent);
  }
}
</style>
