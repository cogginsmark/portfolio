<template>
  <div id="contact">
    <ThemeRoot>
    <section class="contact-main" aria-labelledby="contact-heading">
      <h1 id="contact-heading" class="contact-title">Contact me</h1>
      <div class="contact-actions">
        <StyledButton glass primary color="#363636" :href="`mailto:${email}`"><span class="text-button-text">Email</span><i class="fas fa-envelope"></i></StyledButton>
        <StyledButton glass secondary v-bind:href="cta.url"><span class="text-button-text">{{ cta.label }}</span><i class="fas fa-arrow-down"></i></StyledButton>
        <StyledButton glass secondary v-bind:href="journalism.url" target="_blank" rel="noopener"><span class="text-button-text">{{ journalism.label }}</span><span class="journalism-icon" aria-hidden="true">history_edu</span></StyledButton>
        <StyledButton glass secondary v-for="(link, index) in stackLinks" :key="`contact-link-${index}`" v-bind:href="link.url" target="_blank" rel="noopener"><span class="text-button-text">{{ link.name }}</span><i v-bind:class="link.fa"></i></StyledButton>
      </div>
    </section>
    <foot v-bind:author="author" v-bind:footer="footer" hide-links/>
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
  computed: {
    // The profile links join the main stack as buttons, minus the
    // mailto entry — the Email button at the top of the stack already
    // covers it, so a second Email button at the end was redundant
    // (Mark, 2026-10-30).
    stackLinks() {
      return this.footer.links.filter(link => !link.url.startsWith('mailto:'))
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
/* The page is a Linktree-style stack under a "Contact me" title,
   centred in the viewport space between the header and the footer. */
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

/* The page header is a plain "Contact me" title in the same display
   treatment the email address used to carry — the Email button in
   the stack below is the mailto action (Mark, 2026-10-30). */
.contact-title {
  font-size: clamp(1.5rem, 5.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--main-color);
  margin: 0;
  /* The page itself arrives instantly (App's route transition
     skips Contact), so the title does the arriving alone —
     delayed a beat, then a short fade in (Mark's call,
     2026-10-30). */
  animation: contact-title-in 0.5s ease 0.35s both;
}

@keyframes contact-title-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-title {
    animation: none;
  }
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

</style>
