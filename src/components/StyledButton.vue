<template>
  <a
    ref="root"
    class="styled-button"
    :class="{ primary, secondary, 'lg-glass': glass, 'lg-button': glass, 'lg-button--glass': glass }"
    :style="primary ? { '--btn-primary-bg': color } : {}"
    :data-liquid-glass="glass ? '' : undefined"
    @pointerdown="onPointerDown"
  >
    <!-- Glass mode (patch 002): the slot renders directly, as the
         button's own children — call sites now supply the library's
         structure themselves (an .lg-button__icon span and an
         .lg-button__label span), instead of the whole slot being
         wrapped in the label as the first pass had it. -->
    <slot />
  </a>
</template>

<script>
import { ref } from 'vue'
import { usePress } from './liquid-glass/engine/press.js'
import { useRefraction } from './liquid-glass/engine/refraction.js'
import { haptic } from './liquid-glass/engine/haptics.js'

// The card button. Was `styled('a', btnProps)` from vue-styled-components in
// Card.vue (and re-exported for Hero.vue). Theme-driven values now come from
// the CSS variables ThemeRoot sets; the `color` prop (primary background)
// is passed through as a variable because it is per-link data, not theme.
export default {
  name: 'StyledButton',
  props: {
    primary: Boolean,
    secondary: Boolean,
    color: String,
    // Liquid Glass (branch feat/liquid-glass): render on the
    // @zakisheriff/liquid-glass button system instead — the classes
    // above, plus the library's press and refraction behaviour
    // wired in setup() below, with the same arguments its own
    // GlassButton uses at the default size. The hero trio and the
    // Contact stack pass it; card buttons do not.
    glass: Boolean
  },
  setup(props) {
    const root = ref(null)
    // The glass flag is fixed for the life of every instance in
    // this app (a given button is always glass or never), so the
    // engine wiring is attached once, only where it applies.
    if (props.glass) {
      usePress(root)
      useRefraction(root, {
        kind: 'surface',
        strength: 1,
        bezel: Math.min(44 * 0.36, 22)
      })
    }
    const onPointerDown = () => {
      if (props.glass) haptic()
    }
    return { root, onPointerDown }
  }
}
</script>

<style scoped>
.styled-button {
  font-size: 0.66rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  /* Wider side margins (Mark's call, 2026-10-30): the
     site-wide Apple-spec pill sweep — every button the
     site makes breathes at 1.75rem a side. */
  padding: 0.75rem 1.75rem;
  font-weight: bold;
  margin-right: 20px;
  border-radius: 24px;
  line-height: 40px;
  color: black;
  background: white;
  box-shadow: none;
}
.styled-button.primary {
  color: #eee;
  background: var(--btn-primary-bg);
  box-shadow: var(--card-button-shadow-primary);
}
.styled-button.secondary {
  color: var(--card-button-text);
  background: var(--card-button-background);
  box-shadow: var(--card-button-shadow-secondary);
}

/* Glass variant: the library owns the surface (fill, blur, edge,
   shadow, typography); the legacy declarations above are stood down
   where they would fight it. (Carried over from the first Liquid
   Glass pass, fd70778; the engine underneath them is now the
   library's own.) One metric is deliberately NOT the library's:
   the inline padding. Its 0.42 × height measure (~1.16rem) sat
   under the site-wide pill sweep and crowded the trailing icons
   these buttons carry (Mark's report from the branch preview,
   2026-10-31), so glass pills take the sweep's own measures —
   1.75rem a side here, 1.25rem in the phone block below. The
   text-to-icon gap is the library's own button-level 8px, which
   at this type size equals the site's standing 0.5em — the
   measure did not change, only where it lives (patch 002). */
.styled-button.lg-button {
  background: transparent;
  box-shadow: var(--lg-glass-shadow, var(--lg-shadow)), inset 0 0 0 0.5px var(--lg-edge);
  line-height: 1;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-transform: none;
  padding: 0 1.75rem;
  height: var(--lg-h, 44px);
}

.styled-button.lg-button::before {
  display: none;
}

/* The library's icon box, with this site's font glyphs in it
   (patch 002): the package stylesheet stretches svg and
   .lg-symbol children of .lg-button__icon to fill the box, but
   these buttons' glyphs are webfont elements, so they are seated
   explicitly — FontAwesome at the balanced 18px from the weight
   check, the Material symbol at 20px (its reserved 1em square
   scales with its font size), both centred by the box's grid. */
.styled-button.lg-button .lg-button__icon > i {
  font-size: 18px;
  line-height: 1;
}

.styled-button.lg-button .lg-button__icon .journalism-icon {
  font-size: 20px;
}

.styled-button.lg-button .text-button-text {
  margin-right: 0;
}
/* Won't transition background since card can't transition. */
/* transition: 0.3s background; */
.styled-button::before {
  content: "";
  height: 100%;
  width: 100%;
  background: var(--card-button-hover);
  mix-blend-mode: luminosity;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 24px;
  animation: none;
  opacity: 0;
  transition: 0.3s opacity ease-in-out, 0.3s background;
}
.styled-button:hover::before {
  opacity: var(--card-button-hover-intensity);
  transition: 0.3s opacity ease-in-out, 0.3s background;
}

@media screen and (max-width: 40rem) {
  /* The mobile step-down (Mark's call, 2026-10-30), in the one
     place every button the site makes shares: every metric
     down from the button's own values — type, line, padding —
     the same approach the hero trio's fix established, now
     applied site-wide instead of only there. */
  .styled-button {
    font-size: 0.6rem;
    line-height: 1.6rem;
    /* The sweep's phone measure: 1.25rem a side. */
    padding: 0.55rem 1.25rem;
  }

  /* Glass pills keep their library height and type at this size;
     only the inline padding steps down, to the same phone
     measure as every other button the site makes. */
  .styled-button.lg-button {
    padding: 0 1.25rem;
  }
}
</style>
