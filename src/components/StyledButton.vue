<template>
  <a
    class="styled-button"
    :class="{ primary, secondary, 'lg-glass': glass, 'lg-button': glass, 'lg-button--glass': glass }"
    :style="primary ? { '--btn-primary-bg': color } : {}"
  >
    <span v-if="glass" class="lg-button__label"><slot /></span>
    <slot v-else />
  </a>
</template>

<script>
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
    // Liquid Glass experiment (branch feat/liquid-glass): render on
    // the @zakisheriff/liquid-glass button system instead.
    glass: Boolean
  }
}
</script>

<style scoped>
.styled-button {
  font-size: 0.66rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 0.75rem 1.5rem;
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
   where they would fight it. */
.styled-button.lg-button {
  background: transparent;
  box-shadow: var(--lg-glass-shadow, var(--lg-shadow)), inset 0 0 0 0.5px var(--lg-edge);
  line-height: 1;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-transform: none;
  padding: 0 calc(var(--lg-h, 44px) * 0.42);
  height: var(--lg-h, 44px);
}

.styled-button.lg-button::before {
  display: none;
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
</style>
