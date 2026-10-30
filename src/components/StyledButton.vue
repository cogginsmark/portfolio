<template>
  <a
    class="styled-button"
    :class="{ primary, secondary }"
    :style="primary ? { '--btn-primary-bg': color } : {}"
  >
    <slot />
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
    color: String
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
    padding: 0.55rem 0.9rem;
  }
}
</style>
