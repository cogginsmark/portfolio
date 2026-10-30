<template>
  <div class="hero-background">
    <div class="hero-container">
      <div class="hero-text-container">
        <h1 class="hero-heading">{{author}}</h1>
        <p class="text-paragraph text-subtitle">{{subtitle}}</p>
        <p class="text-paragraph" style="white-space: pre-wrap;">{{description}}</p>
        <div class="cta-section">
          <StyledButton glass secondary :color="'#363636'" v-bind:href="ctaUrl || '/resume.pdf'"><span class="text-button-text">{{cta}}</span><i class="fas fa-arrow-down"></i></StyledButton>
          <StyledButton glass v-if="cta2" secondary :color="'#363636'" v-bind:href="cta2Url" target="_blank" rel="noopener"><span class="text-button-text">{{cta2}}</span><span class="journalism-icon" aria-hidden="true">history_edu</span></StyledButton>
          <StyledButton glass v-if="cta3" secondary :color="'#363636'" v-bind:href="cta3Url"><span class="text-button-text">{{cta3}}</span><i class="fas fa-play"></i></StyledButton>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import StyledButton from './StyledButton.vue'

// StyledButton was previously re-exported from Card.vue (both were
// vue-styled-components); it is now its own component.
export default {
  components: {
    StyledButton
  },
  props: {
    author: String,
    cta: String,
    cta2: String,
    cta3: String,
    ctaUrl: String,
    cta2Url: String,
    cta3Url: String,
    subtitle: String,
    description: String
  }
}
</script>

<style scoped>
.hero-background {
  background: var(--hero-background-image);
  background-size: cover;
  background-position: 50%;
  height: 800px;
  width: 100%;
  min-width: 360px;
  margin: auto;

  /* Responsive */
  height: 100vh;
  min-height: 600px;
  max-height: 1035px;
}
@media screen and (max-width: 980px) {
  .hero-background {
    background-position: 60% -45px;
    background-size: inherit;
  }
}

.hero-container {
  max-width: 980px;
  margin: auto;
  /* padding-top: 180px; */

  /* Responsive */
  height: 100vh;
  min-height: 600px;
  max-height: 1035px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-text-container {
  /* Fluid under its authored size (2026-10-30): the column is
     390px where there is room and shrinks with the viewport
     instead of holding a fixed width to the smallest screens. */
  width: min(390px, calc(100% - 1.25rem));
  margin: 10px;

  /* Responsive */
  margin-top: -20px;
}
@media screen and (max-width: 980px) {
  .hero-text-container {
    width: min(320px, calc(100% - 1.25rem));
    margin: auto;
  }
}

.hero-heading {
  font-size: 3rem;
  margin: 0.67em auto;
  font-weight: bold;
  line-height: var(--leading-display);
  letter-spacing: -0.015em;
}
@media screen and (max-width: 61.25rem) {
  .hero-heading {
    font-size: 2.625rem;
  }
}

.cta-section {
  margin: 2.25rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;
}

.cta-section :deep(.styled-button) {
  margin-right: 0;
  /* Equal-width trio (Mark's pick, 2026-10-30): every button takes
     exactly half the row less half the gap, so all three share one
     width and the wrapped third lands precisely under the first
     instead of centring on its own row at its own size. */
  flex: 0 1 calc(50% - 0.5rem);
  max-width: calc(50% - 0.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* On mobile the pair stays side by side on one row and the third
   wraps under the first at the same width. */
@media screen and (max-width: 61.25rem) {
  .cta-section {
    flex-wrap: wrap;
  }

  .cta-section :deep(.styled-button) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* On small phones the trio gives up the row entirely and stacks
   full-width, one button per row, edges flush with the text
   column (Mark's fallback pick, 2026-10-30). */
@media screen and (max-width: 40rem) {
  .cta-section :deep(.styled-button) {
    flex-basis: 100%;
    max-width: 100%;
  }
}

/* On mobile the hero stops being a full-viewport stage: it was
   centring its text inside a 100vh box that starts below the header,
   which dropped the name far down the screen over an empty wash
   (Mark's screenshot, 2026-10-29). Now the hero hugs its content —
   text starts up under the header, and the bottom padding leaves
   exactly the room the raised cards overlap into. */
@media screen and (max-width: 61.25rem) {
  .hero-background {
    height: auto;
    min-height: 0;
    max-height: none;
  }

  .hero-container {
    height: auto;
    min-height: 0;
    max-height: none;
    justify-content: flex-start;
    padding: 3.5rem 0 6.5rem;
  }

  .hero-text-container {
    margin-top: 0;
  }
}
</style>
