<template>
  <div id="contact">
    <ThemeRoot>
    <section class="contact-main" aria-labelledby="contact-heading">
      <h1 id="contact-heading" class="visually-hidden">Contact</h1>
      <a class="contact-email" :href="`mailto:${email}`">{{ email }}</a>
      <div class="contact-actions">
        <StyledButton glass primary color="#363636" :href="`mailto:${email}`"><span class="text-button-text">Email</span><i class="fas fa-envelope"></i></StyledButton>
        <StyledButton glass secondary v-bind:href="cta.url"><span class="text-button-text">{{ cta.label }}</span><i class="fas fa-arrow-down"></i></StyledButton>
        <StyledButton glass secondary v-bind:href="journalism.url" target="_blank" rel="noopener"><span class="text-button-text">{{ journalism.label }}</span><span class="journalism-icon" aria-hidden="true">history_edu</span></StyledButton>
      </div>
    </section>
    <foot v-bind:author="author" v-bind:footer="footer"/>
    </ThemeRoot>
  </div>
</template>

<script>
// @ is an alias to /src
import ThemeRoot from './components/ThemeRoot.vue'
import Foot from './components/Foot.vue'
import StyledButton from './components/StyledButton.vue'
import baseData from './data/3fixtures.ts'

export default {
  name: 'Contact',
  data() {
    return {
      ...baseData
    }
  },
  components: {
    ThemeRoot,
    Foot,
    StyledButton
  },
}
</script>

<style scoped>
/* The page is designed around two things only — the email and the
   Resume / CV button — centred in the viewport space between the
   header and the footer. */
.contact-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  text-align: center;
  padding: 6rem 1.25rem 5rem;
  min-height: 55vh;
}

.contact-email {
  font-size: clamp(1.5rem, 5.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--main-color);
  text-decoration: none;
  overflow-wrap: anywhere;
  transition: opacity 0.2s ease;
}

.contact-email:hover {
  opacity: 0.65;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

/* Linktree-style: the actions are a single stacked column of
   full-width buttons, evenly spaced, in a narrow centred measure. */
.contact-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  width: min(24rem, 100%);
  margin-inline: auto;
}

.contact-actions :deep(.styled-button) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-right: 0;
  box-sizing: border-box;
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
