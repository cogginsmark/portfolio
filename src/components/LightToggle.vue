<template>
  <button
    type="button"
    class="theme-pill"
    aria-label="Background"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggleTheme"
  >
    <span class="theme-pill-label">Background</span>
    <span class="theme-pill-ms" aria-hidden="true">{{ isDark ? 'contrast_inverse' : 'contrast' }}</span>
  </button>
</template>

<script>
import { localStore, toggleTheme } from '../theme.js'

// The light/dark control as a simple pill (Mark's pick,
// 2026-10-30) with a fixed face (his Background design, the
// same day): the label always reads "Background" and the
// icon is Material Symbols' contrast pair, flipped with the
// theme — contrast in light, contrast_inverse in dark — so
// neither the text nor the icon's motif changes on toggle;
// the pressed treatment and aria-pressed carry the state.
// One labelled face in both of its homes: a row in the
// mobile Menu panel, and — on desktop — a floating pill at
// the page's bottom-right corner, mounted by App.vue (Mark's
// call, 2026-10-30: out of the header, label restored).
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

.theme-pill-ms {
  font-family: 'Material Symbols Rounded';
  font-size: 1.15rem;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
  /* The reserved block (the site's icon rule, as on the
     Journalism glyph): a fixed 1em square from first paint,
     so the button is built at the glyph's final size — and
     together with the font's display=block loading, the
     ligature's name text ("contrast") never paints before
     the icon arrives (Mark's call, 2026-10-30). */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1em;
  block-size: 1em;
  flex: none;
  overflow: hidden;
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
