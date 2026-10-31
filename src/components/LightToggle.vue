<template>
  <button
    type="button"
    class="theme-pill lg-glass"
    data-liquid-glass=""
    aria-label="Background"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="toggleTheme"
  >
    <span class="theme-pill-label">Background</span>
    <span class="lg-button__icon"><span class="theme-pill-ms" aria-hidden="true">{{ isDark ? 'contrast_inverse' : 'contrast' }}</span></span>
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
  /* Liquid Glass (patch 003): the pill takes the library's glass
     surface and its icon-box structure — the surface (fill, blur,
     edge, shadow) comes from .lg-glass; --lg-h is declared so the
     package's icon-box rule (0.48 × height) has the measure it
     expects, at the library's canonical button height. */
  --lg-h: 44px;
  display: inline-flex;
  align-items: center;
  gap: var(--pill-icon-gap);
  min-height: 2.25rem;
  margin: 0;
  /* Wider sides in the Apple-spec sweep (Mark's call,
     2026-10-30): 1.25rem, the panel rows' new measure —
     in the panel the header's parity rule sets the exact
     row metrics over this. */
  padding: 0.45rem 1.25rem;
  border: 0;
  border-radius: 999px;
  /* The old transparent ground stands down: .lg-glass paints the
     surface now (its background-color outranks nothing here —
     this declaration is simply gone so the fill can land). */
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
  /* Size comes from the port's optical balancing layer
     (patch 005): cap-height derived, like every other glyph in
     the glass pills; the instance below stays the glyph's own —
     weight 500, opsz 20. */
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
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
   treatment for the current thing. The 6% tint stays: it takes
   the fill's place as the background colour while the glass
   blur underneath it persists, so the pressed state reads as
   tinted glass. The inset ring stands down, because the glass
   edge does that job now (the doubled edge was the dark
   header's complaint in the e0b409d round). */
.theme-pill[aria-pressed="true"] {
  background-color: color-mix(in srgb, var(--main-color) 6%, transparent);
  box-shadow: var(--lg-glass-shadow, var(--lg-shadow)), inset 0 0 0 0.5px var(--lg-edge);
}

@media (hover: hover) {
  .theme-pill:hover {
    background-color: color-mix(in srgb, var(--main-color) 8%, transparent);
  }
}
</style>
