<template>
  <div class="hero-background">
    <div class="hero-container">
      <div class="hero-text-container">
        <h1 class="hero-heading">{{author}}</h1>
        <p class="text-paragraph text-subtitle">{{subtitle}}</p>
        <p class="text-paragraph" style="white-space: pre-wrap;">{{description}}</p>
        <div class="cta-section">
          <StyledButton secondary :color="'#363636'" v-bind:href="'/resume.pdf'"><span class="text-button-text">{{cta}}</span><i class="fas fa-arrow-down"></i></StyledButton>
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
  /* TODO: CONFIGURABLE */
  width: 390px;
  margin: 10px;

  /* Responsive */
  margin-top: -20px;
}
@media screen and (max-width: 980px) {
  .hero-text-container {
    width: 320px;
    margin: auto;
  }
}

.hero-heading {
  font-size: 3rem;
  margin: 32px auto;
  font-weight: bold;
}
@media screen and (max-width: 980px) {
  .hero-heading {
    font-size: 42px;
  }
}

.cta-section {
  margin: 36px 0px;
}
</style>
